import COMBINING_ from "./data/combining.json";
import CONFUSABLE_GRAPHEMES_ from "./data/confusables.json";

// set of combining characters
const COMBINING: string[] = COMBINING_;

// grapheme -> (canonical, num other confusables)
const CONFUSABLE_GRAPHEMES: { [key: string]: (string | number)[] } = CONFUSABLE_GRAPHEMES_;

function isCombining(char: string): boolean {
  if (char.length !== 1) {
    throw new TypeError("combining() argument must be a unicode character, not str");
  }
  // TODO: optimize this
  return COMBINING.includes(char);
}

function checkGraphemeConfusableWithCombiningMarks(grapheme: string): boolean {
  return grapheme.length > 1 && !isCombining(grapheme[0]) && grapheme.slice(1).split("").every(isCombining);
}

export function checkGraphemeConfusable(grapheme: string): boolean {
  if (/^[a-z0-9_$-]+$/.test(grapheme)) {
    return false;
  }

  if (CONFUSABLE_GRAPHEMES[grapheme]) {
    if (CONFUSABLE_GRAPHEMES[grapheme][0] === grapheme && CONFUSABLE_GRAPHEMES[grapheme][1] === 0) {
      return false;
    } else {
      return true;
    }
  }

  return checkGraphemeConfusableWithCombiningMarks(grapheme);
}

function getCanonicalGrapheme(grapheme: string): string | null {
  if (checkGraphemeConfusableWithCombiningMarks(grapheme)) {
    return grapheme[0];
  }

  if (CONFUSABLE_GRAPHEMES[grapheme]) {
    return CONFUSABLE_GRAPHEMES[grapheme][0] as string;
  }

  return grapheme.length === 1 ? grapheme : null;
}

export function getCanonical(grapheme: string): string | null {
  const canonical = getCanonicalGrapheme(grapheme);
  if (canonical !== null || grapheme.length === 1) {
    return canonical;
  } else {
    return getCanonical([...grapheme][0]);
  }
}

export interface ConfusableAnalysis {
  isConfusable: boolean;
  canonical: string | null;
}

export function graphemeConfusableAnalysis(grapheme: string): ConfusableAnalysis {
  const isConfusable = checkGraphemeConfusable(grapheme);
  const canonical = getCanonical(grapheme);
  return { isConfusable, canonical };
}
