import Decimal from "decimal.js";
import { describe, it, expect } from "vitest";

import {
  bigIntToNumber,
  decimalToBigInt,
  numberToBigInt,
  stringToBigInt,
} from "./number";

describe("decimalToBigInt() function", () => {
  it("Correctly returns zero for Decimal params smaller than or equal to 0.5s", () => {
    const tests = [
      new Decimal(0.1),
      new Decimal(0.2),
      new Decimal(0.3),
      new Decimal(0.4),
      new Decimal(0.49),
      new Decimal(0.5),
    ];

    tests.forEach((test) => {
      expect(decimalToBigInt(test)).toBe(0n);
    });
  });

  it("Correctly returns one for Decimal params greater than 0.5s", () => {
    const tests = [
      new Decimal(0.51),
      new Decimal(0.6),
      new Decimal(0.7),
      new Decimal(0.8),
      new Decimal(0.9),
      new Decimal(1),
    ];

    tests.forEach((test) => {
      expect(decimalToBigInt(test)).toBe(1n);
    });
  });
  it("Correctly converts positive decimals to BigInt", () => {
    expect(decimalToBigInt(new Decimal("123.456"))).toBe(123n);
    expect(decimalToBigInt(new Decimal("9007199254740991.999"))).toBe(
      9007199254740992n,
    );
  });

  it("Correctly converts negative decimals to BigInt", () => {
    expect(decimalToBigInt(new Decimal("-456.789"))).toBe(-457n); // Rounded down
    expect(decimalToBigInt(new Decimal("-9007199254740991.999"))).toBe(
      -9007199254740992n,
    ); // Rounded down
  });

  it("Correctly converts decimals with fractional part less than 0.5 to BigInt (ROUND_HALF_DOWN)", () => {
    expect(decimalToBigInt(new Decimal("123.499"))).toBe(123n);
  });

  it("Correctly converts decimals with fractional part equal to 0.5 to BigInt (ROUND_HALF_DOWN)", () => {
    expect(decimalToBigInt(new Decimal("123.5"))).toBe(123n);
  });

  it("Correctly converts decimals with fractional part greater than 0.5 to BigInt (ROUND_HALF_DOWN)", () => {
    expect(decimalToBigInt(new Decimal("123.501"))).toBe(124n); // Rounded up
  });

  it("Correctly handles decimals with a large number of decimal places", () => {
    expect(
      decimalToBigInt(new Decimal("123.456789012345678901234567890")),
    ).toBe(123n);
  });

  it("Correctly handles zero as a decimal", () => {
    expect(decimalToBigInt(new Decimal("0"))).toBe(0n);
  });

  it("Correctly handles negative zero as a decimal", () => {
    expect(decimalToBigInt(new Decimal("-0.001"))).toBe(0n);
  });

  it("Correctly throws an error for invalid Decimal input", () => {
    // Assuming your Decimal library throws an error for invalid input
    expect(() => decimalToBigInt(new Decimal("abc"))).toThrowError(
      "[DecimalError] Invalid argument: abc",
    );
  });
});

describe("stringToBigInt() function", () => {
  it("Correctly converts zero as a string", () => {
    expect(stringToBigInt("0")).toBe(0n);
  });

  it("Correctly converts a large positive integer string", () => {
    expect(stringToBigInt("123456789012345678901234567890")).toBe(
      123456789012345678901234567890n,
    );
  });

  it("Correctly converts a large negative integer string", () => {
    expect(stringToBigInt("-123456789012345678901234567890")).toBe(
      -123456789012345678901234567890n,
    );
  });

  it("Correctly converts a hexadecimal string", () => {
    expect(stringToBigInt("0x1a")).toBe(BigInt(0x1a));
  });

  it("Correctly converts an octal string", () => {
    expect(stringToBigInt("0o777")).toBe(BigInt(0o777));
  });

  it("Correctly throws an error for non-numeric strings", () => {
    expect(() => stringToBigInt("abc")).toThrowError(
      "Cannot convert string: abc to BigInt",
    );
  });

  it("Correctly throws an error for strings with non-numeric characters and numeric part", () => {
    expect(() => stringToBigInt("123abc")).toThrowError(
      "Cannot convert string: 123abc to BigInt",
    );
  });

  it("Correctly throws an error for a string with special characters", () => {
    expect(() => stringToBigInt("@#$%^")).toThrowError(
      "Cannot convert string: @#$%^ to BigInt",
    );
  });

  it("Correctly throws an error for a string representing a floating-point number", () => {
    expect(() => stringToBigInt("123.45")).toThrowError(
      "Cannot convert string: 123.45 to BigInt",
    );
  });

  it("Correctly handles leading or trailing whitespace in input string", () => {
    expect(stringToBigInt("  42  ")).toBe(42n);
  });

  it('Correctly throws an error for a string starting with "0x" but not a valid hexadecimal number', () => {
    expect(() => stringToBigInt("0xinvalid")).toThrowError(
      "Cannot convert string: 0xinvalid to BigInt",
    );
  });
});

describe("numberToBigInt() function", () => {
  it("Correctly converts positive integers to BigInt", () => {
    expect(numberToBigInt(123)).toBe(123n);
    expect(numberToBigInt(9007199254740991)).toBe(9007199254740991n); // Largest positive integer
  });

  it("Correctly converts negative integers to BigInt", () => {
    expect(numberToBigInt(-456)).toBe(-456n);
    expect(numberToBigInt(-9007199254740991)).toBe(-9007199254740991n); // Largest negative integer
  });

  it("Correctly converts zero to BigInt", () => {
    expect(numberToBigInt(0)).toBe(0n);
  });

  it("Correctly handles floating-point numbers by discarding the fractional part", () => {
    expect(numberToBigInt(123.456)).toBe(123n);
  });

  it("Correctly handles very large floating-point numbers by converting to BigInt", () => {
    const largeNumber = 1e19; // 10^19
    expect(numberToBigInt(largeNumber)).toBe(BigInt(largeNumber));
  });

  it("Correctly handles very small floating-point numbers by converting to BigInt", () => {
    const smallNumber = 1e-19; // 10^-19
    expect(numberToBigInt(smallNumber)).toBe(0n);
  });

  it("Correctly handles positive infinity by throwing an error", () => {
    expect(() => numberToBigInt(Number.POSITIVE_INFINITY)).toThrowError(
      "Cannot convert number: Infinity to BigInt",
    );
  });

  it("Correctly handles negative infinity by throwing an error", () => {
    expect(() => numberToBigInt(Number.NEGATIVE_INFINITY)).toThrowError(
      "Cannot convert number: -Infinity to BigInt",
    );
  });

  it("Correctly handles NaN by throwing an error", () => {
    expect(() => numberToBigInt(NaN)).toThrowError(
      "Cannot convert number: NaN to BigInt",
    );
  });

  it("Correctly throws an error for non-numeric input", () => {
    expect(() => numberToBigInt("abc" as any)).toThrowError(
      "Cannot convert number: abc to BigInt",
    );
  });
});

describe("bigIntToNumber() function", () => {
  it("Correctly converts positive BigInts to numbers", () => {
    expect(bigIntToNumber(123n)).toBe(123);
    expect(bigIntToNumber(9007199254740991n)).toBe(9007199254740991);
  });

  it("Correctly converts negative BigInts to numbers", () => {
    expect(bigIntToNumber(-456n)).toBe(-456);
    expect(bigIntToNumber(-9007199254740991n)).toBe(-9007199254740991);
  });

  it("Correctly handles zero BigInt", () => {
    expect(bigIntToNumber(0n)).toBe(0);
  });

  it("Correctly handles very large BigInts by converting to numbers", () => {
    const largeBigInt = 9007199254740991123456789n;
    expect(bigIntToNumber(largeBigInt)).toBe(9.007199254740991e24);
  });

  it("Correctly handles very small BigInts by converting to numbers", () => {
    const smallBigInt = -9007199254740991123456789n;
    expect(bigIntToNumber(smallBigInt)).toBe(-9.007199254740991e24);
  });
});
