import { COMBINING } from "./data/combining";
import { CONFUSABLE_GRAPHEMES } from "./data/confusables";
import { isCharacter, splitCharacters } from "./utils";

/**
 * Checks if a given character is a Unicode "combining" character.
 *
 * @param char - The character to check.
 * @returns `true` if the character is a combining character, `false` otherwise.
 * @throws {TypeError} If the argument is not a single unicode character.
 */
function isCombining(char: string): boolean {
  if (!isCharacter(char)) {
    throw new TypeError(
      "combining() argument must be a unicode character, not str",
    );
  }
  return COMBINING.has(char);
}

/**
 * Checks if a grapheme is of the form `base character + sequence of combining marks`.
 * Such a grapheme is considered confusable with the base character.
 *
 * @param grapheme - The grapheme to check.
 * @returns A boolean indicating whether the grapheme is confusable.
 */
function checkGraphemeConfusableWithCombiningMarks(grapheme: string): boolean {
  const characters = splitCharacters(grapheme);
  // Grapheme is confusable if:
  return (
    // has more than one character
    characters.length > 1 &&
    // and first character is not a combining mark
    !isCombining(characters[0]) &&
    // and all other characters are combining marks
    characters.slice(1).every(isCombining)
  );
}

const SIMPLE_STRING_REGEX = /^[a-z0-9_$-]+$/;

/**
 * Checks if a string is "simple".
 * A simple string consists of lowercase letters (a-z), digits (0-9), underscore (_), dollar sign ($), and hyphen (-).
 * A simple string does not contain confusable graphemes.
 *
 * @param str - The string to check.
 * @returns `true` if the string is simple, `false` otherwise.
 */
function isSimpleString(str: string): boolean {
  return SIMPLE_STRING_REGEX.test(str);
}

export function checkGraphemeConfusable(grapheme: string): boolean {
  if (isSimpleString(grapheme)) {
    // Simple strings are not confusable
    return false;
  }

  const confusable = CONFUSABLE_GRAPHEMES.get(grapheme);
  // If the grapheme is in CONFUSABLE_GRAPHEMES, it might be confusable
  if (confusable !== undefined) {
    if (
      confusable.canonical === grapheme &&
      confusable.numConfusables === 0
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
  return checkGraphemeConfusableWithCombiningMarks(grapheme);
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

  if (checkGraphemeConfusableWithCombiningMarks(grapheme)) {
    return characters[0];
  }

  const confusable = CONFUSABLE_GRAPHEMES.get(grapheme);
  if (confusable !== undefined) {
    return confusable.canonical;
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
  const isConfusable = checkGraphemeConfusable(grapheme);
  const canonical = getCanonical(grapheme);
  return { isConfusable, canonical };
}
