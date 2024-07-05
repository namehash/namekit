// for compression the json type is:
// { [key: string]: [string, number] }
import GRAPHEME_CANONICALS_ from "./canonicals.json";

/**
 * Stores information about a potentially confusable grapheme and its canonical form.
 */
export interface GraphemeCanonical {
  /**
   * The grapheme that is considered the canonical form of this grapheme.
   */
  canonicalGrapheme: string;

  /**
   * The number of other graphemes that this grapheme is confusable with.
   * Always greater than or equal to 0.
   */
  numConfusables: number;
};

/**
 * Map containing graphemes and their canonical forms.
 */
export const GRAPHEME_CANONICALS: Map<string, GraphemeCanonical> =
  new Map(
    Object.entries(GRAPHEME_CANONICALS_ as { [key: string]: [string, number] })
    .map(([k, v]) => [k, { canonicalGrapheme: v[0], numConfusables: v[1] }]));
