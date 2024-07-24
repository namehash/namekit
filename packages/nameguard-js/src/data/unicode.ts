import EMOJI_SEQUENCES_ from './emoji_sequences.json';
import EMOJI_ZWJ_SEQUENCES_ from './emoji_zwj_sequences.json';
import EMOJI_BLOCK_STARTS_ from './emojis_starts.json';
import EMOJI_BLOCK_IS_EMOJI_ from './emojis_is_emoji.json';

/**
 * This is a set of strings where each string represents a Unicode emoji.
 * It provides a quick lookup to determine if a given string is an emoji.
 * The data is taken directly from the Unicode standard at https://unicode.org/.
 */
export const EMOJI_SEQUENCES: Set<string> = new Set(EMOJI_SEQUENCES_);

/**
 * This is a set of strings where each string represents a Unicode emoji which contains a Zero Width Joiner (ZWJ) character.
 * It provides a quick lookup to determine if a given string is an emoji with a ZWJ character.
 * The data is taken directly from the Unicode data files at https://unicode.org/.
 */
export const EMOJI_ZWJ_SEQUENCES: Set<string> = new Set(EMOJI_ZWJ_SEQUENCES_);

/**
 * The following two fields are used to determine if a given code point is an emoji using binary search.
 * EMOJI_BLOCK_STARTS is an array of code points where each code point represents the start of a contiguous block of characters.
 * A block ends at the next block start, or the maximum allowed Unicode code point value, whichever is smaller.
 * EMOJI_BLOCK_IS_EMOJI is an array of booleans where each boolean value indicates
 * whether the corresponding block of characters contains only emojis or only non-emojis.
 * All characters in a block are either all emojis or all non-emojis.
 * The blocks are generated from the Unicode data files at https://unicode.org/.
 */
export const EMOJI_BLOCK_STARTS: number[] = EMOJI_BLOCK_STARTS_;
export const EMOJI_BLOCK_IS_EMOJI: boolean[] = EMOJI_BLOCK_IS_EMOJI_;
