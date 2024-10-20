import { initializeCanonicals } from "./canonicals";
import { initializeCombining } from "./combining";
import { initializeHangulJamo } from "./hangul";
import { initializeInvisibleJoiners } from "./invisible_joiners";
import { initializeUnicode } from "./unicode";

let INITIALIZED = false;

/**
 * Initializes all data structures.
 * This function should be called before any other functions in this module.
 * It is a no-op if it has already been called.
 */
export function initializeData() {
  if (INITIALIZED) {
    return;
  }
  initializeCanonicals();
  initializeCombining();
  initializeHangulJamo();
  initializeInvisibleJoiners();
  initializeUnicode();
  INITIALIZED = true;
}
