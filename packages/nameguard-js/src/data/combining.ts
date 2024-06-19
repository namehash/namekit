// string[]
import COMBINING_ from "./combining.json";

/**
 * Array of characters classified as "Combining" according to the Unicode Standard version 15.1.0.
 */
export const COMBINING: Set<string> = new Set(COMBINING_ as string[]);
