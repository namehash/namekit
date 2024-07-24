import HANGUL_JAMO_ from './hangul_jamo.json';

/**
 * Contains all Hangul Jamo characters.
 * Data is taken from https://unicode.org/.
 */
export const HANGUL_JAMO: Set<string> = new Set(HANGUL_JAMO_);
