/**
 * Contains invisible characters which are joined with preceding graphemes.
 * Data is taken from the NameHash ens-label-inspector Python package.
 */
export let INVISIBLE_JOINERS: Set<string> | null = null;

export function initializeInvisibleJoiners() {
  const INVISIBLE_JOINERS_: string[] = require("./invisible_joiners.json");
  INVISIBLE_JOINERS = new Set(INVISIBLE_JOINERS_);
}
