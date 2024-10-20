/**
 * This is a set of strings where each string represents a Unicode emoji.
 * It provides a quick lookup to determine if a given string is an emoji.
 * This does not include emojis with Zero Width Joiner (ZWJ) characters.
 * The data is taken directly from Unicode version 15.1.0 at https://unicode.org/.
 */
export let EMOJI_SEQUENCES: Set<string> | null = null;

/**
 * This is a set of strings where each string represents a Unicode emoji formed with Zero Width Joiner (ZWJ) characters.
 * It provides a quick lookup to determine if a given string is an emoji with a ZWJ character.
 * This does not include emojis without ZWJ characters.
 * The data is taken directly from Unicode version 15.1.0 at https://unicode.org/.
 */
export let EMOJI_ZWJ_SEQUENCES: Set<string> | null = null;

/**
 * The following two fields are used to determine if a given code point is an emoji using binary search.
 * EMOJI_BLOCK_STARTS is an array of code points where each code point represents the start of a contiguous block of characters.
 * A block ends at the next block start, or the maximum allowed Unicode code point value, whichever is smaller.
 * EMOJI_BLOCK_IS_EMOJI is an array of booleans where each boolean value indicates
 * whether the corresponding block of characters contains only emojis or only non-emojis.
 * All characters in a block are either all emojis or all non-emojis.
 * The blocks are generated from Unicode version 15.1.0 at https://unicode.org/.
 */
export let EMOJI_BLOCK_STARTS: number[] | null = null;
export let EMOJI_BLOCK_IS_EMOJI: boolean[] | null = null;

export function initializeUnicode() {
  const EMOJI_SEQUENCES_: string[] = require("./emoji_sequences.json");
  const EMOJI_ZWJ_SEQUENCES_: string[] = require("./emoji_zwj_sequences.json");
  const EMOJI_BLOCK_STARTS_: number[] = require("./emojis_starts.json");
  const EMOJI_BLOCK_IS_EMOJI_: boolean[] = require("./emojis_is_emoji.json");

  EMOJI_SEQUENCES = new Set(EMOJI_SEQUENCES_);
  EMOJI_ZWJ_SEQUENCES = new Set(EMOJI_ZWJ_SEQUENCES_);
  EMOJI_BLOCK_STARTS = EMOJI_BLOCK_STARTS_;
  EMOJI_BLOCK_IS_EMOJI = EMOJI_BLOCK_IS_EMOJI_;
}
