/**
 * Contains all Hangul Jamo characters.
 * Data is taken from https://unicode.org/ using Unicode version 15.1.0.
 * This set is used in grapheme splitting to handle arbitrary Jamo sequences.
 */
export let HANGUL_JAMO: Set<string> | null = null;

export function initializeHangulJamo() {
  const HANGUL_JAMO_: string[] = require("./hangul_jamo.json");
  HANGUL_JAMO = new Set(HANGUL_JAMO_);
}
