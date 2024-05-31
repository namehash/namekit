import { keccak256, stringToBytes } from 'viem';
import { normalizeKeccak256Hash } from './hashutils';
import { LruStringMap } from './lru';

/**
 * The Keccak-256 hash of a label.
 */
export interface LabelHash {
  /**
   * The Keccak-256 hash of a label.
   *
   * Always normalized to be prefixed with "0x" and all in lowercase.
   */
  labelHash: `0x${string}`;
}

/**
 * The strategy to use when building the `LabelHash` for a `label` where
 * `isEncodedLabelhash(label)` is `true`.
 */
export const EncodedLabelHashInterpretationStrategy = {
  /**
   * The `label` will be interpreted literally, independent of `isEncodedLabelhash(label)`.
   */
  Literal: 'LITERAL',

  /**
   * If `isEncodedLabelhash(label)` then the `label` will be interpreted as an encoded
   * `LabelHash` for an unknown label rather than as a literal label value.
   */
  UnknownLabel: 'UNKNOWN_LABEL',
} as const;

export type EncodedLabelhashInterpretationStrategy =
  (typeof EncodedLabelHashInterpretationStrategy)[keyof typeof EncodedLabelHashInterpretationStrategy];

/**
 * Options for the `buildLabelHash` function.
 */
export interface LabelHashOptions {
  /**
   * The strategy to use when interpreting `label` where `isEncodedLabelhash(label)` is `true`.
   */
  encodedLabelhashInterpretationStrategy?: EncodedLabelhashInterpretationStrategy;
}

export const DEFAULT_LABELHASH_OPTIONS: Required<LabelHashOptions> = {
  encodedLabelhashInterpretationStrategy:
    EncodedLabelHashInterpretationStrategy.UnknownLabel,
};

const getLabelHashOptions = (
  options?: LabelHashOptions
): Required<LabelHashOptions> => {
  return {
    ...DEFAULT_LABELHASH_OPTIONS,
    ...options,
  };
};

const LABELHASH_CACHE = new LruStringMap<LabelHash>(8192);

/**
 * Calculates the `LabelHash` of `label`.
 *
 * @param label label to calculate the `LabelHash` of.
 * @param options the strategy to use when building the `LabelHash` for a
 *                `label` where `isEncodedLabelhash(label)` is `true`.
 * @returns the `LabelHash` of `label`.
 */
export const buildLabelHash = (
  label: string,
  options?: LabelHashOptions
): LabelHash => {
  const { encodedLabelhashInterpretationStrategy } =
    getLabelHashOptions(options);

  const cacheKey = `${label}:${encodedLabelhashInterpretationStrategy}`;
  const cachedLabelHash = LABELHASH_CACHE.get(cacheKey);

  if (cachedLabelHash) return cachedLabelHash;

  const labelHash = _buildLabelHash(
    label,
    encodedLabelhashInterpretationStrategy
  );

  LABELHASH_CACHE.set(cacheKey, labelHash);

  return labelHash;
};

/**
 * Core implementation of the `buildLabelHash` function.
 */
const _buildLabelHash = (
  label: string,
  encodedLabelhashInterpretationStrategy: EncodedLabelhashInterpretationStrategy
): LabelHash => {
  if (label.length === 0)
    return {
      labelHash: EMPTY_LABEL_LABELHASH,
    };

  if (
    encodedLabelhashInterpretationStrategy ==
      EncodedLabelHashInterpretationStrategy.UnknownLabel &&
    isEncodedLabelHash(label)
  ) {
    // Extract the labelhash value from an encoded labelhash.
    return {
      labelHash: normalizeEncodedLabelHashAsLabelHash(label),
    };
  }

  return {
    labelHash: keccak256(stringToBytes(label)),
  };
};

export const normalizeEncodedLabelHashAsLabelHash = (encodedLabelHash: string): `0x${string}` => {
  if (!isEncodedLabelHash(encodedLabelHash)) {
    throw new Error(`Invalid encoded labelhash format: ${encodedLabelHash}`);
  }
  const decodedLabelhash = encodedLabelHash.substring(1, encodedLabelHash.length - 1);
  return normalizeKeccak256Hash(decodedLabelhash) as `0x${string}`;
};

export const normalizeEncodedLabelHashAsEncodedLabelHash = (encodedLabelHash: string): string => {

  const labelHash = normalizeEncodedLabelHashAsLabelHash(encodedLabelHash);
  return `[${labelHash.substring(2)}]`;
};

const EMPTY_LABEL_LABELHASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

const ENCODED_LABELHASH_REGEX = /^\[(?:0x)?[0-9a-f]{64}\]$/i;

const IS_LABELHASH_CACHE = new LruStringMap<boolean>(8192);

/**
 * Checks if `label` is an encoded `LabelHash`.
 *
 * @param label The label to evaluate as being an encoded `LabelHash`.
 * @returns `true` if and only if `label` is an encoded `LabelHash`.
 */
export const isEncodedLabelHash = (label: string): boolean => {
  const cachedResult = IS_LABELHASH_CACHE.get(label);

  if (cachedResult !== undefined) return cachedResult;

  const result = ENCODED_LABELHASH_REGEX.test(label);

  IS_LABELHASH_CACHE.set(label, result);

  return result;
};