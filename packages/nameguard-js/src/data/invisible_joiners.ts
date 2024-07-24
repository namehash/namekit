import INVISIBLE_JOINERS_ from './invisible_joiners.json';

/**
 * Contains invisible characters which are joined with preceding graphemes
 */
export const INVISIBLE_JOINERS: Set<string> = new Set(INVISIBLE_JOINERS_);
