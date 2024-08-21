import {
  Currency,
  PriceCurrencyFormat,
  parseStringToCurrency,
} from "./currency";
import { approxScaleBigInt, stringToBigInt } from "./number";

export interface Price {
  // TODO: consider adding a constraint where value is never negative
  /**
   * The value of the price. This is a BigInt to avoid floating point math issues when working with prices.
   * For example, a price of 1.23 USD would be represented as 123n with a currency of USD.
   * Note that the value is always in the smallest unit of the currency (e.g. cents for USD, wei for ETH).
   * See the CurrencyConfig for the related currency for the number of decimals to use when converting the value to a human-readable format.
   */
  value: bigint;

  currency: Currency;
}

// An ExchangeRates object maps different currencies to their rate in USD,
// which is a number value. One example of an ExchangeRates object would be:
// { ETH: 1737.16, DAI: 0.99999703, USDC: 1, WETH: 1737.16, USD: 1 }
export interface ExchangeRates extends Partial<Record<Currency, number>> {}

/**
 * Builds a Price object.
 * @param value the value of the price. This is a BigInt to avoid floating point math issues when working with prices.
 * For example, a price of 1.23 USD would be represented as 123n with a currency of USD.
 * Note that the value is always in the smallest unit of the currency (e.g. cents for USD, wei for ETH).
 * See the CurrencyConfig for the related currency for the number of decimals to use when converting the value to a human-readable format.
 * @param currency
 * @returns
 */
export const buildPrice = (
  value: bigint | string,
  currency: Currency | string,
): Price => {
  let priceValue: bigint;
  let priceCurrency: Currency;

  if (typeof value === "string") {
    priceValue = stringToBigInt(value);
  } else {
    priceValue = value;
  }

  if (typeof currency === "string") {
    priceCurrency = parseStringToCurrency(currency);
  } else {
    priceCurrency = currency;
  }

  return { value: priceValue, currency: priceCurrency };
};

export const priceAsNumber = (price: Price): number => {
  return (
    Number(price.value) /
    10 ** Number(PriceCurrencyFormat[price.currency].Decimals)
  );
};

export const numberAsPrice = (number: number, currency: Currency): Price => {
  const currencyDecimals = Number(PriceCurrencyFormat[currency].Decimals);

  // Fix the number's displayed decimals (e.g. from 0.00001 to 0.00001)
  const numberWithCorrectCurrencyDecimals = Number(
    number.toFixed(currencyDecimals),
  );

  // Remove the decimals from the number (e.g. from 0.00001 to 1)
  const numberWithoutDecimals = Number(
    numberWithCorrectCurrencyDecimals * 10 ** currencyDecimals,
  ).toFixed(0);

  /*
    Below Number() conversion deals with possibility of scientific notation being
    returned from toFixed() method call in "numberWithoutDecimals" definition
  */
  const numberReadyToBeConvertedToBigInt = Number(numberWithoutDecimals);

  // Safely convert the number to BigInt
  return {
    value: BigInt(numberReadyToBeConvertedToBigInt),
    currency,
  };
};

export const addPrices = (prices: Array<Price>): Price => {
  const currency = prices[0].currency;

  if (prices.some((price) => price.currency !== currency)) {
    const currencies = prices.map((price) => price.currency).join(", ");

    throw new Error(`Cannot add prices of different currencies: ${currencies}`);
  } else {
    return {
      currency: currency,
      value: prices.reduce((accumulator: bigint, price: Price) => {
        return accumulator + price.value;
      }, 0n),
    };
  }
};

export const subtractPrices = (price1: Price, price2: Price): Price => {
  if (price1.currency !== price2.currency) {
    throw new Error(
      `Cannot subtract price of currency ${price1.currency} to price of currency ${price2.currency}`,
    );
  } else {
    return {
      currency: price1.currency,
      value: price1.value - price2.value,
    };
  }
};

export const multiplyPriceByNumber = (price1: Price, price2: number): Price => {
  const inputNumberAsPrice = numberAsPrice(price2, price1.currency);

  return {
    value:
      (price1.value * inputNumberAsPrice.value) /
      10n ** PriceCurrencyFormat[price1.currency].Decimals,
    currency: price1.currency,
  };
};

export const PriceSymbology = {
  /**
   * The price will be displayed with the currency's acronym (e.g. USD).
   */
  Acronym: "Acronym",
  /**
   * The price will be displayed with the currency's symbol (e.g. $).
   */
  Symbol: "Symbol",
} as const;
export type PriceSymbology =
  (typeof PriceSymbology)[keyof typeof PriceSymbology];

export const formattedPrice = ({
  price,
  withPrefix = false,
  withSufix = false,
  symbology = PriceSymbology.Symbol,
}: {
  price: Price;
  withPrefix?: boolean;
  withSufix?: boolean;
  symbology?: PriceSymbology;
}): string => {
  let formattedAmount = "";
  const valueConsideringDecimals = (
    Number(price.value) /
    10 ** Number(PriceCurrencyFormat[price.currency].Decimals)
  ).toFixed(Number(PriceCurrencyFormat[price.currency].DisplayDecimals));
  const numericValue = Number(valueConsideringDecimals);

  const minimumCurrencyPrice =
    PriceCurrencyFormat[price.currency].MinDisplayValue;
  const valueIsLessThanCurrencyMinimum = price.value <= minimumCurrencyPrice;

  const wouldDisplayAsZero = numericValue == 0.0;
  if (
    (wouldDisplayAsZero && price.value != 0n) ||
    valueIsLessThanCurrencyMinimum
  ) {
    // If formatted number is 0.0 but real 'value' is not 0, then we show the Underflow price
    formattedAmount = String(
      PriceCurrencyFormat[price.currency].MinDisplayValue,
    );
  } else if (wouldDisplayAsZero && price.value == 0n) {
    // But if the real 'value' is really 0, then we show 0.00 (in the correct number of Display Decimals)
    const prefix = "0.";
    formattedAmount = prefix.padEnd(
      Number(PriceCurrencyFormat[price.currency].DisplayDecimals) +
        prefix.length,
      "0",
    );
  }

  const displayNumber = !!formattedAmount
    ? Number(formattedAmount)
    : numericValue;

  formattedAmount = displayNumber.toLocaleString("en-US", {
    minimumFractionDigits: Number(
      PriceCurrencyFormat[price.currency].DisplayDecimals,
    ),
    maximumFractionDigits: Number(
      PriceCurrencyFormat[price.currency].DisplayDecimals,
    ),
  });

  if (numericValue > PriceCurrencyFormat[price.currency].MaxDisplayValue) {
    formattedAmount = PriceCurrencyFormat[price.currency].OverflowDisplayPrice;
  }

  const prefixUnit = withPrefix
    ? symbology === PriceSymbology.Acronym
      ? PriceCurrencyFormat[price.currency].Acronym
      : PriceCurrencyFormat[price.currency].Symbol
    : "";
  const postfixUnit = withSufix
    ? symbology === PriceSymbology.Acronym
      ? PriceCurrencyFormat[price.currency].Acronym
      : PriceCurrencyFormat[price.currency].Symbol
    : "";

  let priceDisplay =
    prefixUnit && prefixUnit !== postfixUnit
      ? prefixUnit + formattedAmount
      : formattedAmount;
  if (postfixUnit) priceDisplay += ` ${postfixUnit}`;
  return priceDisplay;
};

export const approxScalePrice = (
  price: Price,
  scaleFactor: number,
  digitsOfPrecision = 20n,
): Price => {
  return {
    value: approxScaleBigInt(price.value, scaleFactor, digitsOfPrecision),
    currency: price.currency,
  };
};

export const convertCurrencyWithRates = (
  fromPrice: Price,
  toCurrency: Currency,
  exchangeRates: ExchangeRates,
): Price => {
  if (typeof exchangeRates[toCurrency] === "undefined") {
    throw new Error(`Exchange rate for currency ${toCurrency} not found`);
  } else if (typeof exchangeRates[fromPrice.currency] === "undefined") {
    throw new Error(
      `Exchange rate for currency ${fromPrice.currency} not found`,
    );
  }

  const rate = exchangeRates[fromPrice.currency]! / exchangeRates[toCurrency]!;
  const valueAsNumber = priceAsNumber(fromPrice);
  const exchangedValue = valueAsNumber * rate;
  const exchangedValuePrice = numberAsPrice(exchangedValue, toCurrency);

  return exchangedValuePrice;
};
