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
}

/**
 * Map containing graphemes and their canonical forms.
 * This data is taken from the NameHash ens-label-inspector Python package.
 */
export let GRAPHEME_CANONICALS: Map<string, GraphemeCanonical> | null = null;

export function initializeCanonicals() {
  // The json stores the data as a map of grapheme -> [canonicalGrapheme, numConfusables]
  const GRAPHEME_CANONICALS_: {
    [key: string]: [string, number];
  } = require("./canonicals.json");
  GRAPHEME_CANONICALS = new Map(
    Object.entries(GRAPHEME_CANONICALS_).map(([k, v]) => [
      k,
      { canonicalGrapheme: v[0], numConfusables: v[1] },
    ]),
  );
}
