import { charCount } from "@namehash/ens-utils";

export { charCount };

/**
 * Checks if the given string is a single character.
 * 
 * @param text - The string to check.
 * @returns `true` if the string is a single character, `false` otherwise.
 */
export function isCharacter(text: string): boolean {
  return charCount(text) === 1;
}

/**
 * Splits a string into an array of individual characters.
 *
 * @param text - The string to split.
 * @returns An array of individual characters.
 */
export function splitCharacters(text: string): string[] {
  return [...text];
}
