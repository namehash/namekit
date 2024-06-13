import {
  Currency,
  PriceCurrencyFormat,
  parseStringToCurrency,
} from "./currency";
import { DomainCard, DomainName } from "./domain";
import { MIN_ETH_REGISTRABLE_LABEL_LENGTH } from "./ensname";
import { approxScaleBigInt, stringToBigInt } from "./number";
import {
  PrimaryRegistrationStatus,
  Registration,
  SecondaryRegistrationStatus,
} from "./registration";
import {
  Duration,
  SECONDS_PER_DAY,
  Timestamp,
  addSeconds,
  buildDuration,
  formatTimestampAsDistanceToNow,
  now,
} from "./time";

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

export const GRACE_PERIOD: Readonly<Duration> = buildDuration(
  90n * SECONDS_PER_DAY.seconds,
);
export const TEMPORARY_PREMIUM_DAYS = 21n;

export const TEMPORARY_PREMIUM_PERIOD: Readonly<Duration> = buildDuration(
  TEMPORARY_PREMIUM_DAYS * SECONDS_PER_DAY.seconds,
);

export const DOMAIN_HAS_SPECIAL_PRICE_IF_LENGTH_EQUAL_OR_LESS_THAN = 5;

/*
  This is an "internal" helper function only. It can't be directly used anywhere else because
  it is too easy to accidently not include the registration object when it should be passed.
  Three different functions are created right below this one, which are the ones that are
  safe to be used across the platform, and are then, the ones being exported.
*/
const AvailableNamePriceUSD = (
  parsedName: DomainName,
  registerForYears = DEFAULT_REGISTRATION_YEARS,
  registration: Registration | null = null,
  additionalFee: Price | null = null,
): Price | null => {
  if (!parsedName.normalizedName) return null;

  const defaultPrice: Readonly<Price> = {
    value: 500n,
    currency: Currency.Usd,
  };
  const shortNamePremium: Record<number, Readonly<Price>> = {
    [MIN_ETH_REGISTRABLE_LABEL_LENGTH]: {
      value: 64000n,
      currency: Currency.Usd,
    },
    4: {
      value: 16000n,
      currency: Currency.Usd,
    },
  };
  const basePrice = shortNamePremium[parsedName.labelName.length]
    ? shortNamePremium[parsedName.labelName.length]
    : defaultPrice;

  const namePriceForYears = multiplyPriceByNumber(
    basePrice,
    Number(registerForYears),
  );

  const namehashPrice = additionalFee
    ? addPrices([additionalFee, namePriceForYears])
    : namePriceForYears;

  if (registration) {
    const premiumPrice = nameCurrentTemporaryPremium(registration);

    return premiumPrice
      ? addPrices([premiumPrice, namehashPrice])
      : namehashPrice;
  }

  return namehashPrice;
};

/*
  Below function returns the "timeless" price for a name, that takes no consideration
  of the current status of the name. This is useful for various cases, including in
  generating messages that communicate how much a name costs to renew, how much
  a name will cost at the end of a premium period, etc..
*/
export const AvailableNameTimelessPriceUSD = (
  domainName: DomainName,
  registerForYears = DEFAULT_REGISTRATION_YEARS,
) => {
  return AvailableNamePriceUSD(domainName, registerForYears);
};

/*
  This interface defines data that is used to display the price of a domain
  in the Ui. The reason we are separating this text in different fields is because:

  1. We want to be able to display different texts depending on wether the price of
  the domain is a premium price or not. In each one of these cases, the text displayed
  is different.
  2. Since the design for this data displaying is differently defined for the price field
  and the descriptive text, we separate it so we can render these two fields separately in the
  HTML that will be created inside the component. e.g. the price field is bold and the descriptive
  text is not. Please refer to this Figma artboard for more details: https:/*www.figma.com/file/lZ8HZaBcfx1xfrgx7WOsB0/Namehash?type=design&node-id=12959-119258&mode=design&t=laEDaXW0rg9nIVn7-0
*/
interface PriceDescription {
  /* descriptiveTextBeginning references the text that is displayed before the price */
  descriptiveTextBeginning: string;
  /* pricePerYear is a string that represents: Price + "/ year" (e.g. "$5.99 / year") */
  pricePerYearDescription: string;
  /* descriptiveTextBeginning references the text that is displayed after the price */
  descriptiveTextEnd: string;
}

export const getPriceDescription = (
  registration: Registration,
  parsedName: DomainName,
): PriceDescription | null => {
  const isExpired =
    registration.primaryStatus === PrimaryRegistrationStatus.Expired;
  const wasRecentlyReleased =
    registration.secondaryStatus ===
    SecondaryRegistrationStatus.RecentlyReleased;
  const isRegistered =
    registration.primaryStatus === PrimaryRegistrationStatus.Active;

  if (!(isExpired && wasRecentlyReleased) && isRegistered) return null;
  const domainBasePrice = AvailableNameTimelessPriceUSD(parsedName);

  if (!domainBasePrice) return null;
  else {
    const domainPrice = formattedPrice({
      price: domainBasePrice,
      withPrefix: true,
    });
    const pricePerYearDescription = `${domainPrice} / year`;

    const premiumEndsIn = premiumPeriodEndsIn(registration)?.relativeTimestamp;

    if (premiumEndsIn) {
      const premiumEndMessage = premiumEndsIn
        ? ` Temporary premium ends ${premiumEndsIn}.`
        : null;
      const basePriceMessage = domainBasePrice
        ? " Discounts continuously until dropping to "
        : null;

      return {
        pricePerYearDescription,
        descriptiveTextBeginning:
          "Recently released." + premiumEndMessage + basePriceMessage,
        descriptiveTextEnd: ".",
      };
    } else {
      const domainLabelLength = parsedName.labelName.length;
      console.log(
        domainLabelLength,
        DOMAIN_HAS_SPECIAL_PRICE_IF_LENGTH_EQUAL_OR_LESS_THAN,
      );
      return domainLabelLength <
        DOMAIN_HAS_SPECIAL_PRICE_IF_LENGTH_EQUAL_OR_LESS_THAN
        ? {
            pricePerYearDescription,
            descriptiveTextBeginning: `${domainLabelLength}-character names are `,
            descriptiveTextEnd: " to register.",
          }
        : null;
    }
  }
};

const DEFAULT_REGISTRATION_YEARS = 1;

export const nameCurrentTemporaryPremium = (
  registration: Registration,
): Price | null => {
  if (registration.expirationTimestamp) {
    return temporaryPremiumPriceAtTimestamp(
      now(),
      registration.expirationTimestamp,
    );
  } else {
    return null;
  }
};

/* Interface for premium period end details */
export interface PremiumPeriodEndsIn {
  relativeTimestamp: string;
  timestamp: Timestamp;
}

/**
 * Determines if a domain is in its premium period and returns the end timestamp and a human-readable distance to it.
 * @param domainCard: DomainCard
 * @returns PremiumPeriodEndsIn | null
 */
export const premiumPeriodEndsIn = (
  registration: Registration,
): PremiumPeriodEndsIn | null => {
  const isExpired =
    registration.primaryStatus === PrimaryRegistrationStatus.Expired;
  const wasRecentlyReleased =
    registration.secondaryStatus ===
    SecondaryRegistrationStatus.RecentlyReleased;

  /*
    A domain will only have a premium price if it has Expired and it was Recently Released
  */
  if (!isExpired || !wasRecentlyReleased) return null;

  /*
    This conditional should always be true because expiryTimestamp will only be null when
    the domain was never registered before. Considering that the domain is Expired,
    it means that it was registered before. It is just a type safety check.
  */
  if (!registration.expiryTimestamp) return null;

  const releasedEpoch = addSeconds(registration.expiryTimestamp, GRACE_PERIOD);
  const temporaryPremiumEndTimestamp = addSeconds(
    releasedEpoch,
    TEMPORARY_PREMIUM_PERIOD,
  );

  return {
    relativeTimestamp: formatTimestampAsDistanceToNow(
      temporaryPremiumEndTimestamp,
    ),
    timestamp: temporaryPremiumEndTimestamp,
  };
};

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

export const formattedPrice = ({
  price,
  withPrefix = false,
  withSufix = false,
}: {
  price: Price;
  withPrefix?: boolean;
  withSufix?: boolean;
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
    ? PriceCurrencyFormat[price.currency].Symbol
    : "";
  const postfixUnit = withSufix
    ? PriceCurrencyFormat[price.currency].Acronym
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

/**
 * At the moment a .eth name expires, this recently released temporary premium is added to its price.
 * NOTE: The actual recently released temporary premium added subtracts `PREMIUM_OFFSET`.
 */
export const PREMIUM_START_PRICE: Price = {
  value: 10000000000n /* $100,000,000.00 (100 million USD) */,
  currency: Currency.Usd,
};

/**
 * The recently released temporary premium drops exponentially by 50% each day.
 */
const PREMIUM_DECAY = 0.5;

/**
 * Goal:
 *  The temporary premium should drop to $0.00 after exactly `PREMIUM_DAYS` days have passed.
 *
 * Challenge:
 *  If we decay `PREMIUM_START` by a rate of `PREMIUM_DECAY` each day over the course of
 *  `PREMIUM_DAYS` days we don't get $0.00 USD. Instead, we get this `PREMIUM_OFFSET` value
 *  ($47.68 USD).
 *
 * Solution:
 *  Subtract this value from the decayed temporary premium to get the actual temporary premium.
 */
export const PREMIUM_OFFSET = approxScalePrice(
  PREMIUM_START_PRICE,
  PREMIUM_DECAY ** Number(TEMPORARY_PREMIUM_DAYS),
);

export function temporaryPremiumPriceAtTimestamp(
  atTimestamp: Timestamp,
  expirationTimestamp: Timestamp,
): Price {
  const releasedTimestamp = addSeconds(expirationTimestamp, GRACE_PERIOD);
  const secondsSinceRelease = atTimestamp.time - releasedTimestamp.time;
  if (secondsSinceRelease < 0) {
    /* if as of the moment of `atTimestamp` a name hasn't expired yet then there is no temporaryPremium */
    return {
      value: 0n,
      currency: Currency.Usd,
    };
  }

  const fractionalDaysSinceRelease =
    Number(secondsSinceRelease) / Number(SECONDS_PER_DAY.seconds);

  const decayFactor = PREMIUM_DECAY ** fractionalDaysSinceRelease;

  const decayedPrice = approxScalePrice(PREMIUM_START_PRICE, decayFactor);
  const offsetDecayedPrice = subtractPrices(decayedPrice, PREMIUM_OFFSET);

  /* the temporary premium can never be less than $0.00 */
  if (offsetDecayedPrice.value < 0n) {
    return {
      value: 0n,
      currency: Currency.Usd,
    };
  }

  return offsetDecayedPrice;
}
