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

export function isEmojiSequence(grapheme: string): boolean {
  return EMOJI_SEQUENCES.has(grapheme);
}

export function isEmojiZwjSequence(grapheme: string): boolean {
  return EMOJI_ZWJ_SEQUENCES.has(grapheme);
}

export function isEmojiChar(char: string): boolean {
  if (charCount(char) != 1) {
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
