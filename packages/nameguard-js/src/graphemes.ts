import { splitGraphemes as splitGraphemesInternal } from "text-segmentation";

// for Hangul Jamo splitting
const HANGUL_REGEXP = new RegExp(/[ᄀ-ᇿ]/.source, "gu");
// TODO: replace with unicode character range instead of those pure symbols
// [\u1100–\u11FF]

/**
 * Splits the input string into what users perceive as "characters", called graphemes.
 *
 * This function does not try to be fully compliant with the Unicode grapheme splitting algorithm.
 * It matches the algorithm used by NameGuard which introduces user-friendly features like Hangul Jamo splitting.
 *
 * Splitting is performed using the [text-segmentation](https://github.com/niklasvh/text-segmentation) library with added special Hangul treatment.
 * This makes it possible to handle strings with arbitrary Hangul Jamo sequences that most operating systems render as distinct graphemes.
 * Without this fix, some Hangul Jamo would be merged into one grapheme which would seem confusing to the user who sees them as separate.
 * See splitGraphemes.test.ts for examples.
 *
 *
 * @param name - normalized domain name to split into graphemes
 * @returns - list of graphemes derived from the input
 */
export function splitGraphemes(name: string): string[] {
  // initial split
  const graphemes = splitGraphemesInternal(name);

  let outputGraphemes = [];
  // Iterate over the graphemes and explode Hangul Jamo into separate graphemes
  for (const grapheme of graphemes) {
    const matchingResults = [...grapheme.matchAll(HANGUL_REGEXP)].flat();
    if (matchingResults.length > 0) {
      // add all Jamo separately
      for (const elem of matchingResults) {
        outputGraphemes.push(elem);
      }
    } else {
      // add the grapheme as is
      outputGraphemes.push(grapheme);
    }
  }

  return outputGraphemes;
}

export function countGraphemes(name: string): number {
  return splitGraphemes(name).length;
}
