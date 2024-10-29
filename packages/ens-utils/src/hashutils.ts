import { id } from "@ethersproject/hash";

/**
 * Simple wrapper around the viem implementation of `labelhash` that returns a generic string instead.
 * @param label label to hash
 * @returns keccak-256 hash of the label
 */
export function labelhash(label: string): string {
  return id(label);
}

const keccak256Regex = /^(?:0x)?[0-9a-f]{64}$/i;

/**
 * The Keccak-256 hash of a name/label.
 *
 * A labelhash is a Keccak-256 hash of a label.
 * An ENSIP-1 namehash is a recursive Keccak-256 hash of the labelhashes of all the labels in a name.
 *
 * A "normalized Keccak-256 hash" is a Keccak-256 hash that is always prefixed with "0x" and all in lowercase.
 * */
export function isKeccak256Hash(hash: string) {
  return keccak256Regex.test(hash);
}

/**
 * Encodes the labelhash value into an encoded labelhash.
 * @param labelhash the labelhash value to encode.
 * @returns the encoded labelhash.
 */
export function encodeLabelhash(labelhash: string) {
  return `[${labelhash}]`;
}

/**
 * Extracts the labelhash value from an encoded labelhash.
 * @param encodedLabelhash the encoded labelhash to decode.
 * @returns the labelhash value of the encoded labelhash.
 */
export function decodeEncodedLabelhash(encodedLabelhash: string) {
  return encodedLabelhash.substring(1, encodedLabelhash.length - 1);
}

/**
 * Checks if the label contains an encoded labelhash.
 * @param label The label to evaluate as containing an encoded labelhash.
 * @returns true if and only if the label contains an encoded labelhash.
 */
export function isEncodedLabelhash(label: string) {
  if (!label.startsWith("[") || !label.endsWith("]")) return false;

  const labelhash = decodeEncodedLabelhash(label);
  return isKeccak256Hash(labelhash);
}

/**
 * Normalizes a Keccak-256 hash. Allows for normalization of hashes that are prefixed or
 * unprefixed or containing hex digits of any capitalization.
 *
 * @param hash the hash to normalize
 * @param withPrefix whether or not to include the "0x" prefix in the normalized hash.
 * @returns a normalized Keccak-256 hash (conditionally prefixed with 0x) that is always all in lowercase).
 * @throws an error if the hash is not a valid Keccak-256 hash.
 */
export function normalizeKeccak256Hash(
  hash: string,
  withPrefix: boolean = true,
) {
  if (!isKeccak256Hash(hash)) {
    throw new Error(`Invalid Keccak-256 hash format: ${hash}`);
  }

  const normalizedHashValue = hash.toLowerCase();

  if (withPrefix && !normalizedHashValue.startsWith("0x")) {
    // prefix of 0x is currently missing and should be added
    return `0x${normalizedHashValue}`;
  } else if (!withPrefix && normalizedHashValue.startsWith("0x")) {
    // prefix of 0x is currently present and should be removed
    return normalizedHashValue.substring(2);
  } else {
    // we're already in the desired format
    return normalizedHashValue;
  }
}

/**
 * Normalized an encoded labelhash to a format of `[labelhash]` where labelhash is a normalized Keccak-256 hash with no `0x` prefix.
 * @param label the label containing an encoded labelhash to normalize.
 * @returns A normalized encoded labelhash.
 */
export function normalizeEncodedLabelhash(label: string) {
  if (!isEncodedLabelhash(label)) {
    throw new Error(`Invalid EncodedLabelhash format: ${label}`);
  }

  const currentLabelhash = decodeEncodedLabelhash(label);
  const normalizedLabelhash = normalizeKeccak256Hash(currentLabelhash, false);
  return encodeLabelhash(normalizedLabelhash);
}
