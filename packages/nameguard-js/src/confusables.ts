import { GRAPHEME_CANONICALS } from "./data/canonicals";
import { isCombiningChar, splitCharacters } from "./utils";

/**
 * Checks if a grapheme is of the form `base character + sequence of combining marks`.
 * Such a grapheme is considered confusable with the base character.
 *
 * @param grapheme - The grapheme to check.
 * @returns A boolean indicating whether the grapheme has combining marks.
 */
function graphemeHasCombiningMarks(grapheme: string): boolean {
  const characters = splitCharacters(grapheme);
  return (
    // has more than one character
    characters.length > 1 &&
    // and first character is not a combining mark
    !isCombiningChar(characters[0]) &&
    // and all other characters are combining marks
    characters.slice(1).every(isCombiningChar)
  );
}

const ALLOWLISTED_NON_CONFUSABLE_GRAPHEME_REGEX = /^[a-z0-9_$-]$/;

/**
 * Checks if a grapheme is an allowlisted non-confusable grapheme.
 *
 * An allowlisted non-confusable grapheme consists of a single character
 * that is a lowercase letter (a-z), digit (0-9), underscore (_), dollar sign ($), or hyphen (-).
 * This is an optimization for the most commonly used graphemes.
 *
 * @param grapheme - The grapheme to check.
 * @returns `true` if the grapheme is allowlisted, `false` otherwise.
 */
function isGraphemeAllowlisted(grapheme: string): boolean {
  return ALLOWLISTED_NON_CONFUSABLE_GRAPHEME_REGEX.test(grapheme);
}

export function isGraphemeConfusable(grapheme: string): boolean {
  if (grapheme.length === 0) {
    // When analyzing a string for confusability,
    // the result is the logical AND of the confusability
    // of each grapheme in the string.
    // An empty string should be the neutral element for this operation,
    // i.e. an empty string is not confusable.
    return false;
  }

  if (isGraphemeAllowlisted(grapheme)) {
    // allowlisted graphemes are not confusable
    return false;
  }

  const canonical = GRAPHEME_CANONICALS.get(grapheme);
  if (canonical !== undefined) {
    // If the grapheme is in GRAPHEME_CANONICALS, it might be confusable
    if (
      canonical.canonicalGrapheme === grapheme &&
      canonical.numConfusables === 0
    ) {
      // If the grapheme is its own canonical and has no other confusables, it is not confusable
      return false;
    } else {
      // If the grapheme has a different canonical form or has other confusables, it is confusable
      return true;
    }
  }

  // If the grapheme is not in CONFUSABLE_GRAPHEMES, it might be a grapheme with combining marks, which is confusable.
  // Otherwise, it is not confusable.
  return graphemeHasCombiningMarks(grapheme);
}

/**
 * Retrieves the canonical form of a grapheme.
 *
 * If the grapheme is a base character with combining marks, the base character is returned.
 *
 * Else, if the grapheme is a known confusable, the canonical form is returned.
 *
 * Else, if the grapheme is a single character, the grapheme itself is returned.
 *
 * Otherwise, the canonical form is not known and null is returned.
 *
 * @param grapheme - The grapheme to retrieve the canonical form for.
 * @returns The canonical form of the grapheme, or null if the canonical form is not known.
 */
function getCanonicalGrapheme(grapheme: string): string | null {
  const characters = splitCharacters(grapheme);

  if (graphemeHasCombiningMarks(grapheme)) {
    return characters[0];
  }

  const canonical = GRAPHEME_CANONICALS.get(grapheme);
  if (canonical !== undefined) {
    return canonical.canonicalGrapheme;
  }

  return characters.length === 1 ? grapheme : null;
}

/**
 * Returns the canonical form of a grapheme using a fallback mechanism
 * which tries returning the canonical form of the first character
 * if the canonical form of the full grapheme is not known.
 *
 * @param grapheme - The grapheme to get the canonical form of.
 * @returns The canonical form of the grapheme, or null if the canonical form is not known.
 */
export function getCanonical(grapheme: string): string | null {
  if (grapheme.length === 0) {
    // When computing the canonical form of a string,
    // the result is the concatenation of the canonical forms of each grapheme in the string.
    // An empty string should be the neutral element for this operation,
    // i.e. the canonical form of an empty string is the empty string.
    return grapheme;
  }
  const canonical = getCanonicalGrapheme(grapheme);
  if (canonical !== null) {
    // Return the result of getCanonicalGrapheme if it found a canonical form
    return canonical;
  } else {
    // If getCanonicalGrapheme failed, try looking at only the first character
    // which might be present in the confusables list (in contrast to the full grapheme)
    return getCanonical(splitCharacters(grapheme)[0]);
  }
}

/**
 * The result of a grapheme's confusability analysis.
 */
export interface ConfusableAnalysis {
  /**
   * Indicates whether the analyzed grapheme is confusable.
   */
  isConfusable: boolean;

  /**
   * The canonical form of the grapheme, or null if the canonical form is not known.
   */
  canonical: string | null;
}

/**
 * Analyzes a grapheme for confusability.
 *
 * @param grapheme - The grapheme to analyze.
 * @returns An object containing the confusability analysis results.
 */
export function graphemeConfusableAnalysis(
  grapheme: string,
): ConfusableAnalysis {
  const isConfusable = isGraphemeConfusable(grapheme);
  const canonical = getCanonical(grapheme);
  return { isConfusable, canonical };
}
