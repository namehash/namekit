import { splitGraphemes as unicodeStandardGraphemeSplit } from "text-segmentation";
import { isEmoji } from "./utils";
import { charSplit } from "@namehash/ens-utils";
import { HANGUL_JAMO } from "./data/hangul";
import { INVISIBLE_JOINERS } from "./data/invisible_joiners";

/**
 * Splits the input string into what users perceive as "characters", called graphemes.
 *
 * This function extends the official Unicode grapheme splitting algorithm with additional features.
 * It matches the algorithm used by NameGuard which introduces user-friendly features like Hangul and invisible character splitting.
 *
 * Splitting is performed using the [text-segmentation](https://github.com/niklasvh/text-segmentation) library with added special Hangul treatment.
 * This makes it possible to handle strings with arbitrary Hangul Jamo sequences that most operating systems render as distinct graphemes.
 * Without this fix, some Hangul Jamo would be merged into one grapheme which would seem confusing to the user who sees them as separate.
 * See splitGraphemes.test.ts for examples.
 * This function also handles invisible characters within graphemes, ensuring they are split into separate graphemes for better clarity.
 *
 * This implementation is safe to use in all modern web browsers,
 * unlike the related browser API for splitting graphemes according to the Unicode standard,
 * which isn't supported by all browsers today.
 *
 * @param name - normalized domain name to split into graphemes
 * @returns - list of graphemes derived from the input
 */
export function splitGraphemes(name: string): string[] {
  // initial split
  let graphemes = unicodeStandardGraphemeSplit(name);

  // break up invisible characters
  let graphemesWithSplitInvisibles = [];
  for (const graphemeStr of graphemes) {
    const graphemeCps = charSplit(graphemeStr);
    let i = graphemeCps.length - 1;
    while (i >= 0) {
      if (INVISIBLE_JOINERS.has(graphemeCps[i])) {
        i--;
      } else {
        break;
      }
    }
    i++;
    const graphemeBaseStr = graphemeCps.slice(0, i).join("");
    if (i === graphemeCps.length) {
      graphemesWithSplitInvisibles.push(graphemeBaseStr);
    } else {
      if (graphemeCps[i] === "\ufe0f" && isEmoji(graphemeBaseStr)) {
        i += 1;
      }
      if (i > 0) {
        graphemesWithSplitInvisibles.push(graphemeCps.slice(0, i).join(""));
      }
      for (let j = i; j < graphemeCps.length; j++) {
        graphemesWithSplitInvisibles.push(graphemeCps[j]);
      }
    }
  }
  graphemes = graphemesWithSplitInvisibles;

  // break up Hangul Jamo
  let graphemesWithSplitHangul = [];
  for (const graphemeStr of graphemes) {
    const graphemeCps = charSplit(graphemeStr);
    let i = 0;
    let j = 1;
    while (j < graphemeCps.length) {
      if (HANGUL_JAMO.has(graphemeCps[j])) {
        graphemesWithSplitHangul.push(graphemeCps.slice(i, j).join(""));
        i = j;
      }
      j++;
    }
    graphemesWithSplitHangul.push(graphemeCps.slice(i, j).join(""));
  }
  graphemes = graphemesWithSplitHangul;

  return graphemes;
}

export function countGraphemes(name: string): number {
  return splitGraphemes(name).length;
}
