import { charCount } from "@namehash/ens-utils";
import { EMOJI_SEQUENCES, EMOJI_ZWJ_SEQUENCES, EMOJI_BLOCK_STARTS, EMOJI_BLOCK_IS_EMOJI } from "./data/unicode";
import { COMBINING } from "./data/combining";

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

/**
 * Checks if the given grapheme is an emoji sequence.
 * 
 * An emoji sequence is a specific combination of code points that represent a single emoji.
 * This function checks if the provided grapheme is present in the predefined set of emoji sequences.
 * 
 * The emoji sequences are based on Unicode 15.1.0 standards.
 *
 * @param grapheme - The grapheme to check.
 * @returns `true` if the grapheme is an emoji sequence, `false` otherwise.
 */
export function isEmojiSequence(grapheme: string): boolean {
  return EMOJI_SEQUENCES.has(grapheme);
}

/**
 * Checks if the given grapheme is an emoji Zero Width Joiner (ZWJ) sequence.
 * 
 * An emoji ZWJ sequence is a specific combination of emoji characters joined by 
 * Zero Width Joiner (U+200D) characters to create a single emoji. This function 
 * checks if the provided grapheme is present in the predefined set of emoji ZWJ sequences.
 * 
 * The emoji ZWJ sequences are based on Unicode 15.1.0 standards.
 *
 * @param grapheme - The grapheme to check.
 * @returns `true` if the grapheme is an emoji ZWJ sequence, `false` otherwise.
 */
export function isEmojiZwjSequence(grapheme: string): boolean {
  return EMOJI_ZWJ_SEQUENCES.has(grapheme);
}

/**
 * Checks if the given character is an emoji character.
 * 
 * This function determines if a single Unicode character is an emoji by checking
 * its code point against predefined emoji blocks.
 * 
 * This function is based on the Unicode 15.1.0 standards.
 * 
 * Returns `false` for multi-character strings.
 *
 * @param char - The character to check.
 * @returns `true` if the character is an emoji character, `false` otherwise.
 */
export function isEmojiChar(char: string): boolean {
  if (!isCharacter(char)) {
    return false;
  }
  const cp = char.codePointAt(0)!;
  // TODO: use binary search
  for (let i = EMOJI_BLOCK_STARTS.length - 1; i >= 0; i--) {
    if (cp >= EMOJI_BLOCK_STARTS[i]) {
      return EMOJI_BLOCK_IS_EMOJI[i];
    }
  }
  // not reachable since cp >= 0 and EMOJI_BLOCK_STARTS[0] == 0
  return false;
}

/**
 * Checks if the given grapheme is an emoji.
 * 
 * This function combines the checks from isEmojiSequence, isEmojiZwjSequence, and isEmojiChar
 * to determine if a grapheme is any type of emoji recognized by Unicode standards.
 * 
 * The function is based on Unicode 15.1.0 standards and covers:
 * - Emoji sequences (including emoji modifier sequences and emoji flag sequences)
 * - Emoji ZWJ (Zero Width Joiner) sequences
 * - Single emoji characters
 *
 * @param grapheme - The grapheme to check.
 * @returns `true` if the grapheme is any type of emoji, `false` otherwise.
 */

export function isEmoji(grapheme: string): boolean {
  return isEmojiSequence(grapheme) || isEmojiZwjSequence(grapheme) || isEmojiChar(grapheme);
}

/**
 * Checks if a given character is a Unicode "combining" character.
 *
 * @param char - The character to check.
 * @returns `true` if the character is a combining character, `false` otherwise.
 * @throws {TypeError} If the argument is not a single unicode character.
 */
export function isCombiningChar(char: string): boolean {
  if (!isCharacter(char)) {
    throw new TypeError(
      "isCombiningChar() argument must be a unicode character, not str",
    );
  }
  return COMBINING.has(char);
}
