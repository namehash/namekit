import Decimal from "decimal.js";

export const stringToBigInt = (stringValue: string): bigint => {
  try {
    return BigInt(stringValue);
  } catch (err) {
    throw new Error(`Cannot convert string: ${stringValue} to BigInt`);
  }
};

export const decimalToBigInt = (decimalValue: Decimal): bigint => {
  return numberToBigInt(
    Number(decimalValue.toFixed(0, Decimal.ROUND_HALF_DOWN))
  );
};

export const numberToBigInt = (numberValue: number): bigint => {
  try {
    return BigInt(numberValue.toFixed(0));
  } catch (err) {
    throw new Error(`Cannot convert number: ${numberValue} to BigInt`);
  }
};

export const bigIntToNumber = (bigIntValue: bigint): number => {
  return Number(bigIntValue);
};

/**
 * Approximately scales a bigIntValue by the scaleFactor, using the specified number of
 * digitsOfPrecision from the scaleFactor.
 *
 * For example:
 * approxScaleBigInt(100n, 0.1, 1n) === 10n.
 * approxScaleBigInt(100n, 0.01, 2n) === 1n.
 * approxScaleBigInt(1234n, 1.1, 0n) === 1234n.
 * approxScaleBigInt(1234n, 1.01, 1n) === 1234n.
 * approxScaleBigInt(1234n, 1000, 20n) === 1233999n, NOT 1234000n.
 *
 * NOTE: As the last example above shows, this function should NOT be assumed to be the
 * same as multiplication. Results may be approximated due to the internal use of
 * floating point numbers.
 *
 * @param bigIntValue the value to scale
 * @param scaleFactor the factor to scale by
 * @param digitsOfPrecision the number of digits of precision to use. Must be non-negative.
 * @returns the scaled value
 */
export const approxScaleBigInt = (
  bigIntValue: bigint,
  scaleFactor: number,
  digitsOfPrecision: bigint
): bigint => {
  if (digitsOfPrecision < 0n)
    throw Error("digitsOfPrecision must be non-negative");

  // bigints are arbitrary-precision integers, whose
  // "digits of precision are limited only by the available memory of the host system".
  // Therefore, this should always be successful unless we run out of memory 😅
  const bigIntInflationFactor = 10n ** digitsOfPrecision;

  const numberInflationFactor = Number(bigIntInflationFactor);
  // check for overflow / underflow / other issues
  if (!Number.isFinite(numberInflationFactor))
    throw Error("Invalid numberInflationFactor");

  const inflatedScaleFactorNumber = scaleFactor * numberInflationFactor;
  // check for overflow / underflow / other issues
  if (!Number.isFinite(inflatedScaleFactorNumber))
    throw Error("Invalid inflatedScaleFactorNumber");

  // the conversion to BigInt here will implicitly cause inflatedScaleFactor to
  // lose any digits of precision beyond digitsOfPrecision
  const inflatedScaleFactorBigInt = BigInt(
    Math.round(inflatedScaleFactorNumber)
  );

  const inflatedResult = bigIntValue * inflatedScaleFactorBigInt;

  const deflatedResult = inflatedResult / bigIntInflationFactor;

  return deflatedResult;
};
