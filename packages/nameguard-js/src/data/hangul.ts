import HANGUL_JAMO_ from './hangul_jamo.json';

/**
 * Contains all Hangul Jamo characters.
 * Data is taken from https://unicode.org/ using Unicode version 15.1.0.
 * This set is used in grapheme splitting to handle arbitrary Jamo sequences.
 */
export const HANGUL_JAMO: Set<string> = new Set(HANGUL_JAMO_);
