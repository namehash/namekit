import EMOJI_SEQUENCES_ from './emoji_sequences.json';
import EMOJI_ZWJ_SEQUENCES_ from './emoji_zwj_sequences.json';
import EMOJI_BLOCK_STARTS_ from './emojis_starts.json';
import EMOJI_BLOCK_IS_EMOJI_ from './emojis_is_emoji.json';

export const EMOJI_SEQUENCES: Set<string> = new Set(EMOJI_SEQUENCES_);
export const EMOJI_ZWJ_SEQUENCES: Set<string> = new Set(EMOJI_ZWJ_SEQUENCES_);
export const EMOJI_BLOCK_STARTS: number[] = EMOJI_BLOCK_STARTS_;
export const EMOJI_BLOCK_IS_EMOJI: boolean[] = EMOJI_BLOCK_IS_EMOJI_;
