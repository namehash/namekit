import { ens_beautify, ens_normalize } from '@adraffy/ens-normalize';
import { LruStringMap } from './lru';

export const LABEL_SEPARATOR = '.';

/**
 * The ENSIP-15 normalization status of a name/label.
 *
 * If a label is in the format of "[labelhash]" (an encoded labelhash) then the `Normalization` of the label is considered to be `unknown`.
 * If a name contains any label that is `unnormalized` then the `Normalization` of the entire name is considered to be `unnormalized`.
 * If a name contains no `unnormalized` labels but 1 or more `unknown` labels then the entire name is considered to be `unknown`.
 * A name is `normalized` if and only if all of its labels are `normalized`.
 */
export type Normalization =
  | 'normalized' /** `normalized`: The name or label is normalized. */
  | 'unnormalized' /** `unnormalized`: The name or label is not normalized. */
  | 'unknown' /** `unknown`: The name or label is unknown because it cannot be looked up from its hash. */;

/**
 * The normalization strategy to use when intepreting name/label values.
 */
export const NormalizationStrategy = {
  /**
   * Normalizes name/label values if possible. If normalization fails for any label, the resulting label will be unmodified.
   */
  TryNormalize: 'TRY',

  /**
   * Interpret name/label values exactly as provided without normalization.
   */
  SkipNormalize: 'SKIP',

  /**
   * Require name/label values to be normalized. If normalization fails an `Error` will be thrown.
   */
  RequireNormalize: 'REQUIRE',
} as const;

export type NormalizationStrategy =
  (typeof NormalizationStrategy)[keyof typeof NormalizationStrategy];

interface NormalizeResult {
  normalized?: string;
  error?: Error;
}

const normalizeSingleLabel = (label: string): NormalizeResult => {
  if (label.includes(LABEL_SEPARATOR))
    throw new Error(
      `Label "${label}" is not valid for ens_normalize as it contains a "." (LABEL_SEPARATOR) character.`
    );

  let result: NormalizeResult = {};

  try {
    result.normalized = ens_normalize(label);
  } catch (error) {
    if (error instanceof Error) {
      result.error = error;
    } else {
      result.error = new Error(
        `ens_normalize threw a non-Error exception: ${error}`
      );
    }
  }

  return result;
};

const getNormalizeResult = (result: NormalizeResult): string => {
  if (result.normalized !== undefined) return result.normalized;
  throw result.error;
};

const NORMALIZE_CACHE = new LruStringMap<NormalizeResult>(8192);

export const normalizeLabel = (label: string): string => {
  let cachedResult = NORMALIZE_CACHE.get(label);

  if (cachedResult) return getNormalizeResult(cachedResult);

  const result = normalizeSingleLabel(label);

  NORMALIZE_CACHE.set(label, result);

  return getNormalizeResult(result);
};

interface BeautifyResult {
  beautified?: string;
  error?: Error;
}

const BEAUTIFY_CACHE = new LruStringMap<BeautifyResult>(8192);

const beautifySingleLabel = (label: string): BeautifyResult => {
  if (label.includes(LABEL_SEPARATOR))
    throw new Error(
      `Label "${label}" is not valid for ens_beautify as it contains a "." (LABEL_SEPARATOR) character.`
    );

  let result: BeautifyResult = {};

  try {
    result.beautified = ens_beautify(label);
  } catch (error) {
    if (error instanceof Error) {
      result.error = error;
    } else {
      result.error = new Error(
        `ens_beautify threw a non-Error exception: ${error}`
      );
    }
  }

  return result;
};

const getBeautifyResult = (result: BeautifyResult): string => {
  if (result.beautified !== undefined) return result.beautified;
  throw result.error;
};

export const beautifyLabel = (label: string): string => {
  let labelToBeautify = label;

  // ens_beautify(label) always produces the same result as ens_beautify(ens_normalize(label)
  let cachedNormalizeResult = NORMALIZE_CACHE.get(label);
  if (cachedNormalizeResult)
    labelToBeautify = getNormalizeResult(cachedNormalizeResult);

  let cachedBeautifyResult = BEAUTIFY_CACHE.get(labelToBeautify);
  if (cachedBeautifyResult) return getBeautifyResult(cachedBeautifyResult);

  const result = beautifySingleLabel(labelToBeautify);

  BEAUTIFY_CACHE.set(labelToBeautify, result);

  return getBeautifyResult(result);
};

export const isNormalizedLabel = (label: string): boolean => {
  try {
    return normalizeLabel(label) === label;
  } catch {
    return false;
  }
};
