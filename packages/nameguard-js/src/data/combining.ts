/**
 * Array of characters classified as "Combining" according to the Unicode Standard version 15.1.0.
 * Data is taken from https://unicode.org/.
 */
export let COMBINING: Set<string> | null = null;

export function initializeCombining() {
  const COMBINING_: string[] = require("./combining.json");
  COMBINING = new Set(COMBINING_);
}
