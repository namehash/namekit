// for compression the type is:
// { [key: string]: [string, number] }
import CONFUSABLE_GRAPHEMES_ from "./confusables.json";

/**
 * Represents information about a confusable grapheme.
 */
export interface ConfusableGrapheme {
  /**
   * The grapheme that is considered the canonical form of this grapheme.
   */
  canonical: string;

  /**
   * The number of other graphemes that this grapheme is confusable with.
   */
  numConfusables: number;
};

/**
 * Map containing confusable graphemes and their corresponding information.
 */
export const CONFUSABLE_GRAPHEMES: Map<string, ConfusableGrapheme> =
  new Map(
    Object.entries(CONFUSABLE_GRAPHEMES_ as { [key: string]: [string, number] })
    .map(([k, v]) => [k, { canonical: v[0], numConfusables: v[1] }]));
