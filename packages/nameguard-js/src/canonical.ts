import { ens_normalize } from "@adraffy/ens-normalize";
import { splitGraphemes } from "./graphemes";
import { graphemeConfusableAnalysis } from "./confusables";

/**
 * Returns the canonical form of the input label.
 *
 * A canonical label is the label where all confusable graphemes are replaced with their canonical form.
 *
 * A canonical grapheme is a grapheme that is considered the "base" version of a grapheme, for example, a Latin letter without diacritics.
 * Some graphemes have no canonical form because of language-specific writing scripts.
 *
 * If the input label contains confusable graphemes with no canonical form, the function returns null.
 *
 * @param label - The input label.
 * @returns The canonical label or null if the label contains confusable graphemes with no canonical form.
 */
export function getCanonicalLabel(label: string): string | null {
  let canonicals: string[] = [];
  for (const grapheme of splitGraphemes(label)) {
    const { isConfusable, canonical } = graphemeConfusableAnalysis(grapheme);
    if (!isConfusable) {
      // not confusable -> is its own canonical
      canonicals.push(grapheme);
    } else if (canonical === null) {
      // confusable but no canonical form
      return null;
    } else {
      // confusable and has canonical form
      canonicals.push(canonical);
    }
  }
  return canonicals.join("");
}

/**
 * Retrieves the ENSIP-15 normalized canonical form of the input label.
 *
 * A canonical label is the label where all confusable graphemes are replaced with their canonical form.
 *
 * A canonical grapheme is a grapheme that is considered the "base" version of a grapheme, for example, a Latin letter without diacritics.
 * Some graphemes have no canonical form because of language-specific writing scripts.
 *
 * If the input label contains confusable graphemes with no canonical form, or if the canonical label cannot be normalized, the function returns null.
 * 
 * @param label - The label to retrieve the normalized canonical label for.
 * @returns The normalized canonical label, or `null` if the label contains graphemes with no canonical form or if the canonical label cannot be normalized.
 */
export function getNormalizedCanonicalLabel(label: string): string | null {
  const canonicalLabel = getCanonicalLabel(label);
  if (canonicalLabel === null) {
    return null;
  }
  try {
    return ens_normalize(canonicalLabel);
  } catch (e) {
    return null;
  }
}
