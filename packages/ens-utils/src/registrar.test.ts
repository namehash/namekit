import { describe, expect, it } from "vitest";
import { scaleAnnualPrice } from "./registrar";
import { buildPrice } from "./price";
import { Currency } from "./currency";
import { buildDuration, SECONDS_PER_YEAR } from "./time";

describe("scaleAnnualPrice() function", (t) => {
  it("should scale a one year price to a half an year price", () => {
    const price = buildPrice(100n, Currency.Usd);
    const years = 0.5;
    const secondsPerYearAsNumber = Number(SECONDS_PER_YEAR.seconds);
    const duration = BigInt(secondsPerYearAsNumber * years);
    const secondsPerYears = buildDuration(duration);

    const expectedResult = {
      value: BigInt(Number(price.value) * years),
      currency: "USD",
    };

    const result = scaleAnnualPrice(price, secondsPerYears);

    expect(result).toEqual(expectedResult);
  });
  it("should scale a one year price to an one and a half an year price", () => {
    const price = buildPrice(100n, Currency.Usd);
    const years = 1.5;
    const secondsPerYearAsNumber = Number(SECONDS_PER_YEAR.seconds);
    const duration = BigInt(secondsPerYearAsNumber * years);
    const secondsPerYears = buildDuration(duration);

    const expectedResult = {
      value: BigInt(Number(price.value) * years),
      currency: "USD",
    };

    const result = scaleAnnualPrice(price, secondsPerYears);

    expect(result).toEqual(expectedResult);
  });
  it("should scale a one year price to a two years price", () => {
    const price = buildPrice(100n, Currency.Usd);
    const years = 2n;
    const secondsPerYears = buildDuration(SECONDS_PER_YEAR.seconds * years);

    const expectedResult = {
      value: price.value * years,
      currency: "USD",
    };

    const result = scaleAnnualPrice(price, secondsPerYears);

    expect(result).toEqual(expectedResult);
  });
  it("should scale a one year price to a five years price", () => {
    const price = buildPrice(100n, Currency.Usd);
    const years = 5n;
    const secondsPerYears = buildDuration(SECONDS_PER_YEAR.seconds * years);

    const expectedResult = {
      value: price.value * years,
      currency: "USD",
    };

    const result = scaleAnnualPrice(price, secondsPerYears);

    expect(result).toEqual(expectedResult);
  });
  it("should not scale the price if the duration is the same as current price duration", () => {
    const price = buildPrice(100n, Currency.Usd);
    const years = 1n;
    const secondsPerYears = buildDuration(SECONDS_PER_YEAR.seconds * years);

    const result = scaleAnnualPrice(price, secondsPerYears);

    expect(result).toEqual(result);
  });
});
