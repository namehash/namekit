import { describe, it, expect } from "vitest";
import {
  Currency,
  CurrencyDisplayRule,
  DEFAULT_PREFERRED_CURRENCY,
  getAlternateDisplayCurrency,
  getPrimaryDisplayCurrency,
  parseStringToCurrency,
} from "./currency";

describe("DEFAULT_PREFERRED_CURRENCY", () => {
  it("should default to USD", () => {
    expect(DEFAULT_PREFERRED_CURRENCY).toBe(Currency.Usd);
  });
});

describe("getPrimaryDisplayCurrency() function", () => {
  it("should return ETH when rule is PreferredCurrency and the given preferred currency was ETH", () => {
    const preferredCurrency = Currency.Eth;

    expect(
      getPrimaryDisplayCurrency(
        CurrencyDisplayRule.PreferredCurrency,
        preferredCurrency,
        Currency.Usd
      )
    ).toBe(preferredCurrency);
  });

  it("should return USD when rule is NativeCurrency and the given native currency was USD", () => {
    const nativeCurrency = Currency.Usd;

    expect(
      getPrimaryDisplayCurrency(
        CurrencyDisplayRule.NativeCurrency,
        Currency.Eth,
        nativeCurrency
      )
    ).toBe(nativeCurrency);
  });
});

describe("getAlternateDisplayCurrency() function", () => {
  it("should return ETH as alternate when rule is PreferredCurrency and both preferred and native are USD", () => {
    expect(
      getAlternateDisplayCurrency(
        CurrencyDisplayRule.PreferredCurrency,
        Currency.Usd,
        Currency.Usd
      )
    ).toBe(Currency.Eth);
  });

  it("should return USD as alternate when rule is PreferredCurrency and both preferred and native are ETH", () => {
    expect(
      getAlternateDisplayCurrency(
        CurrencyDisplayRule.PreferredCurrency,
        Currency.Eth,
        Currency.Eth
      )
    ).toBe(Currency.Usd);
  });

  it("should return native currency when rule is PreferredCurrency and preferred and native are different", () => {
    expect(
      getAlternateDisplayCurrency(
        CurrencyDisplayRule.PreferredCurrency,
        Currency.Eth,
        Currency.Usd
      )
    ).toBe(Currency.Usd);
  });

  it("should return preferred currency when rule is NativeCurrency and preferred and native are different", () => {
    expect(
      getAlternateDisplayCurrency(
        CurrencyDisplayRule.NativeCurrency,
        Currency.Eth,
        Currency.Usd
      )
    ).toBe(Currency.Eth);
  });

  it("should return USD as alternate when rule is NativeCurrency and both preferred and native are ETH", () => {
    expect(
      getAlternateDisplayCurrency(
        CurrencyDisplayRule.NativeCurrency,
        Currency.Eth,
        Currency.Eth
      )
    ).toBe(Currency.Usd);
  });

  it("should return ETH as alternate when rule is NativeCurrency and both preferred and native are USD", () => {
    expect(
      getAlternateDisplayCurrency(
        CurrencyDisplayRule.NativeCurrency,
        Currency.Usd,
        Currency.Usd
      )
    ).toBe(Currency.Eth);
  });
});

describe("parseStringToCurrency() function", () => {
  it("should parse upper-case currencies correctly", () => {
    expect(parseStringToCurrency("USD")).toBe(Currency.Usd);
    expect(parseStringToCurrency("ETH")).toBe(Currency.Eth);
    expect(parseStringToCurrency("DAI")).toBe(Currency.Dai);
    expect(parseStringToCurrency("USDC")).toBe(Currency.Usdc);
    expect(parseStringToCurrency("WETH")).toBe(Currency.Weth);
  });

  it("should parse lower-case currencies correctly", () => {
    expect(parseStringToCurrency("usd")).toBe(Currency.Usd);
    expect(parseStringToCurrency("eth")).toBe(Currency.Eth);
    expect(parseStringToCurrency("dai")).toBe(Currency.Dai);
    expect(parseStringToCurrency("usdc")).toBe(Currency.Usdc);
    expect(parseStringToCurrency("weth")).toBe(Currency.Weth);
  });

  it("should parse capitalized currencies correctly", () => {
    expect(parseStringToCurrency("Usd")).toBe(Currency.Usd);
    expect(parseStringToCurrency("Eth")).toBe(Currency.Eth);
    expect(parseStringToCurrency("Dai")).toBe(Currency.Dai);
    expect(parseStringToCurrency("Usdc")).toBe(Currency.Usdc);
    expect(parseStringToCurrency("Weth")).toBe(Currency.Weth);
  });

  it("should parse currencies written randomly, with lower and upper-case letters, correctly", () => {
    expect(parseStringToCurrency("UsD")).toBe(Currency.Usd);
    expect(parseStringToCurrency("EtH")).toBe(Currency.Eth);
    expect(parseStringToCurrency("DaI")).toBe(Currency.Dai);
    expect(parseStringToCurrency("UsDc")).toBe(Currency.Usdc);
    expect(parseStringToCurrency("WeTh")).toBe(Currency.Weth);
  });

  it("should throw an error for invalid currency string", () => {
    expect(() => parseStringToCurrency("invalid")).toThrow(
      "Cannot convert: \"invalid\" to a recognized Currency"
    );
  });

  it("should throw an error for empty string", () => {
    expect(() => parseStringToCurrency("")).toThrow(
      "Cannot convert: \"\" to a recognized Currency"
    );
  });
});
