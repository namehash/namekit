// string[]
import COMBINING_ from "./combining.json";

/**
 * Array of characters classified as "Combining" according to the Unicode Standard version 15.1.0.
 * Data is taken from https://unicode.org/.
 */
export const COMBINING: Set<string> = new Set(COMBINING_ as string[]);
