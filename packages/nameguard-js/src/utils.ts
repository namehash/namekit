import { charCount } from "@namehash/ens-utils";
import { EMOJI_SEQUENCES, EMOJI_ZWJ_SEQUENCES, EMOJI_BLOCK_STARTS, EMOJI_BLOCK_IS_EMOJI } from "./data/unicode";

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

export function isEmojiSequence(text: string): boolean {
  return EMOJI_SEQUENCES.has(text);
}

export function isEmojiZwjSequence(text: string): boolean {
  return EMOJI_ZWJ_SEQUENCES.has(text);
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

export function isEmoji(text: string): boolean {
  return isEmojiSequence(text) || isEmojiZwjSequence(text) || isEmojiChar(text);
}
