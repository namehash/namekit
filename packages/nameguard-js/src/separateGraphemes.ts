import { splitGraphemes } from "text-segmentation";

/**
 * Separating graphemes with the usage of the external library - text-segmentation (https://github.com/niklasvh/text-segmentation)
 * in colaboration with special Hangul treating.
 *
 * @param name - normalized domain name to separate graphemes from
 * @returns - list of graphemes derived from the input accordingly to unicode standards
 */
export function separateGraphemes(name: string): string[] {
  const graphemes = splitGraphemes(name);
  const regexp = new RegExp(/(?:[ᄀ-ᇿ])/.source, "gv"); //TODO: replace with unicode character range instead of those pure symbols
  // [\u1100–\u11FF]
  const array = [];
  for (const grapheme of graphemes) {
    const matchingResults = [...grapheme.matchAll(regexp)].flat();
    if (matchingResults.length > 0) {
      for (const elem of matchingResults) {
        array.push(elem);
      }
    } else {
      array.push(grapheme);
    }
  }

  return array;
}
