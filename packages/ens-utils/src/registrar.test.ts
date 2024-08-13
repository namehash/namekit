import { describe, expect, it } from "vitest";
import { buildPrice, scaleAnnualPrice } from "./price";
import { Currency } from "./currency";
import { scaleDuration, SECONDS_PER_YEAR } from "./time";

describe("scaleAnnualPrice() function", (t) => {
  it("should scale a one year price to a half an year price", () => {
    const annualPrice = buildPrice(100n, Currency.Usd);
    const years = 0.5;
    const duration = scaleDuration(SECONDS_PER_YEAR, years);
    const result = scaleAnnualPrice(annualPrice, duration);

    const expectedResult = buildPrice(50n, Currency.Usd);

    expect(result).toEqual(expectedResult);
  });

  it("should scale a one year price to an one and a half an year price", () => {
    const annualPrice = buildPrice(100n, Currency.Usd);
    const years = 1.5;
    const duration = scaleDuration(SECONDS_PER_YEAR, years);
    const result = scaleAnnualPrice(annualPrice, duration);

    const expectedResult = buildPrice(150n, Currency.Usd);

    expect(result).toEqual(expectedResult);
  });

  it("should scale a one year price to a two years price", () => {
    const annualPrice = buildPrice(100n, Currency.Usd);
    const years = 2n;
    const duration = scaleDuration(SECONDS_PER_YEAR, years);
    const result = scaleAnnualPrice(annualPrice, duration);

    const expectedResult = buildPrice(200n, Currency.Usd);

    expect(result).toEqual(expectedResult);
  });

  it("should scale a one year price to a five years price", () => {
    const annualPrice = buildPrice(100n, Currency.Usd);
    const years = 5n;
    const duration = scaleDuration(SECONDS_PER_YEAR, years);
    const result = scaleAnnualPrice(annualPrice, duration);

    const expectedResult = buildPrice(500n, Currency.Usd);

    expect(result).toEqual(expectedResult);
  });

  it("should scale a one year price to a one year price", () => {
    const annualPrice = buildPrice(100n, Currency.Usd);
    const years = 1n;
    const duration = scaleDuration(SECONDS_PER_YEAR, years);
    const result = scaleAnnualPrice(annualPrice, duration);

    const expectedResult = buildPrice(100n, Currency.Usd);

    expect(result).toEqual(expectedResult);
  });
});
