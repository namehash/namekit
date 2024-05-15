export enum Currency {
  Dai = "DAI",
  Eth = "ETH",
  Usd = "USD",
  Usdc = "USDC",
  Weth = "WETH",
  Gas = "GAS",
}

export enum CurrencyDisplayRule {
  NativeCurrency = "NativeCurrency",
  PreferredCurrency = "PreferredCurrency",
}

export type SupportedPreferredCurrencies = Currency.Usd | Currency.Eth;

export const DEFAULT_PREFERRED_CURRENCY = Currency.Usd;

export interface CurrencyConfig {
  /*
    Left positioned by default, symbol represents:
    - For ETH: Ξ
    - For USD: $
    - For DAI: DAI
    And so on...
  */
  Symbol: string;
  /*
    Right positioned by default, Acronym represents:
    - For ETH: ETH
    - For USD: USD
    - For DAI: DAI
    And so on...
  */
  Acronym: string;
  // Number of valuable decimals to be preserved when converting Price values between currencies (e.g. 18 Decimals for ETH, 2 Decimals for USD, 18 Decimals for DAI, etc)
  Decimals: bigint;
  // Number of decimals to be shown in DisplayedPrice Ui component (e.g. 0.001 has a DisplayDecimals of 3)
  DisplayDecimals: bigint;
  // How is each unit of a value of the currency called? (e.g. Wei for ETH, Cents of USD, 1/18 of a DAI, etc)
  UnitOfMeasure: string;
  // Maximum Price value to be displayed in the UI
  MaxDisplayValue: number;
  // Minimum Price value to be displayed in the UI
  MinDisplayValue: number;
  // What to display when the Price value is greater than Currency's MaxDisplayValue
  OverflowDisplayPrice: string;
  // Extended name of the currency, for single a unit (e.g. United States Dollar, Ether, Wrapped Ether etc)
  ExtendedCurrencyNameSingular: string;
  // Extended name of the currency, for multiple units (e.g. United States Dollar, Ether, Wrapped Ether etc)
  ExtendedCurrencyNamePlural: string;
  // How one unit of the currency is displayed as a number (e.g. Ether is displayed as 1.000, USD is displayed as 1.00 etc)
  OneUnitOfCurrency: string;
}

export const PriceCurrencyFormat: Record<Currency, CurrencyConfig> = {
  [Currency.Usd]: {
    Acronym: "USD",
    Symbol: "$",
    Decimals: 2n,
    DisplayDecimals: 2n,
    MaxDisplayValue: 99999999.99,
    MinDisplayValue: 0.01,
    OneUnitOfCurrency: "1.00",
    OverflowDisplayPrice: "100+ million",
    ExtendedCurrencyNameSingular: "United States Dollar",
    ExtendedCurrencyNamePlural: "United States Dollars",
    UnitOfMeasure: "Cents",
  },
  [Currency.Eth]: {
    Acronym: "ETH",
    Symbol: "Ξ",
    Decimals: 18n,
    DisplayDecimals: 3n,
    MaxDisplayValue: 999999.999,
    MinDisplayValue: 0.001,
    OneUnitOfCurrency: "1.000",
    OverflowDisplayPrice: "1+ million",
    ExtendedCurrencyNameSingular: "Ether",
    ExtendedCurrencyNamePlural: "Ether",
    UnitOfMeasure: "WEI",
  },
  [Currency.Dai]: {
    Acronym: "DAI",
    Symbol: "DAI",
    Decimals: 18n,
    DisplayDecimals: 2n,
    MaxDisplayValue: 9999999.999,
    MinDisplayValue: 0.01,
    OneUnitOfCurrency: "1.00",
    OverflowDisplayPrice: "100+ million",
    ExtendedCurrencyNameSingular: "DAI Stablecoin",
    ExtendedCurrencyNamePlural: "DAI Stablecoins",
    UnitOfMeasure: "1/18 of a DAI",
  },
  [Currency.Usdc]: {
    Acronym: "USDC",
    Symbol: "$",
    Decimals: 5n,
    DisplayDecimals: 2n,
    MaxDisplayValue: 99999999.99,
    MinDisplayValue: 0.01,
    OneUnitOfCurrency: "1.00",
    OverflowDisplayPrice: "100+ million",
    ExtendedCurrencyNameSingular: "USDC Stablecoin",
    ExtendedCurrencyNamePlural: "USDC Stablecoins",
    UnitOfMeasure: "1/5 of a USDC",
  },
  [Currency.Weth]: {
    Acronym: "WETH",
    Symbol: "Ξ",
    Decimals: 18n,
    DisplayDecimals: 3n,
    MaxDisplayValue: 999999.999,
    MinDisplayValue: 0.001,
    OneUnitOfCurrency: "1.000",
    OverflowDisplayPrice: "1+ million",
    ExtendedCurrencyNameSingular: "Wrapped Ether",
    ExtendedCurrencyNamePlural: "Wrapped Ether",
    UnitOfMeasure: "WEI",
  },
  [Currency.Gas]: {
    Acronym: "GAS",
    Symbol: "GAS",
    Decimals: 0n,
    DisplayDecimals: 0n,
    MaxDisplayValue: 350000,
    MinDisplayValue: 1,
    OneUnitOfCurrency: "1",
    OverflowDisplayPrice: "+350 thousand",
    ExtendedCurrencyNameSingular: "Gas",
    ExtendedCurrencyNamePlural: "Gas",
    UnitOfMeasure: "Gas unit",
  },
};

export const getPrimaryDisplayCurrency = (
  rule: CurrencyDisplayRule,
  preferredCurrency: Currency,
  nativeCurrency: Currency
): Currency => {
  if (rule === CurrencyDisplayRule.PreferredCurrency) {
    return preferredCurrency;
  } else {
    return nativeCurrency;
  }
};

export const getAlternateDisplayCurrency = (
  rule: CurrencyDisplayRule,
  preferredCurrency: Currency,
  nativeCurrency: Currency
): Currency => {
  if (rule === CurrencyDisplayRule.PreferredCurrency) {
    if (nativeCurrency === preferredCurrency) {
      return nativeCurrency === Currency.Usd ? Currency.Eth : Currency.Usd;
    } else {
      return nativeCurrency;
    }
  } else {
    if (nativeCurrency === preferredCurrency) {
      return nativeCurrency === Currency.Usd ? Currency.Eth : Currency.Usd;
    } else {
      return preferredCurrency;
    }
  }
};

export const parseStringToCurrency = (str: string): Currency => {
  const curatedStr = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  const currency = Currency[curatedStr as keyof typeof Currency];

  if (!currency) throw new Error(`Cannot convert: "${str}" to a recognized Currency`);

  return currency;
};
