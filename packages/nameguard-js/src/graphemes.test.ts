import { describe, it, expect } from "vitest";
import { splitGraphemes, countGraphemes } from "./graphemes";
import jsonNamehashExamples from "../utils/normalized_graphemes.json";

const grapehemeTestInputs = [
  "",
  "a",
  "abc",
  "🇪🇹",
  "\u{1F469}\u{1F3FF}\u{200D}\u{1F9B2}",
  "👩🏿‍🎓",
  "Hello 🌍! 👋",
];

const graphemeTestOutputs = [
  [],
  ["a"],
  ["a", "b", "c"],
  ["🇪🇹"],
  ["\u{1F469}\u{1F3FF}\u{200D}\u{1F9B2}"],
  ["👩🏿‍🎓"],
  [
    "H",
    "e",
    "l",
    "l",
    "o",
    " ",
    "🌍",
    "!",
    " ",
    "👋",
  ],
];

describe("countGraphemes", () => {
  it("should count graphemes in a string", () => {
    for (const example_idx in grapehemeTestInputs) {
      expect(countGraphemes(grapehemeTestInputs[example_idx])).toBe(
        graphemeTestOutputs[example_idx].length,
      );
    }
  });
});

describe("splitGraphemes", () => {
  it("should split strings into graphemes", () => {
    for (const example_idx in grapehemeTestInputs) {
      expect(splitGraphemes(grapehemeTestInputs[example_idx])).toStrictEqual(
        graphemeTestOutputs[example_idx],
      );
    }
  });

  it("should split strings the same way as the Python NameGuard library", async () => {
    for (const pair of jsonNamehashExamples) {
      expect(splitGraphemes(pair[0])).toStrictEqual(pair[1]);
    }
  });

  it("should split strings with hanguls", () => {
    expect(splitGraphemes("Helloᄀᄀᄀ 🌍! 👋")).toStrictEqual([
      "H",
      "e",
      "l",
      "l",
      "o",
      "ᄀ",
      "ᄀ",
      "ᄀ",
      " ",
      "🌍",
      "!",
      " ",
      "👋",
    ]);
  });

  it("should split strings covering algorithm edge cases", () => {
    const cases: [string, string[]][] = [
      ["", []],
      ["a", ["a"]],
      ["abc", ["a", "b", "c"]],
      ["a\u200db", ["a", "\u200d", "b"]],
      ["🇪🇹", ["🇪🇹"]],
      ['\u{0001F469}\u{0001F3FF}\u{0000200D}\u{0001F9B2}', ['\u{0001F469}\u{0001F3FF}\u{0000200D}\u{0001F9B2}']],
      ['\u{0001F469}\u{0001F3FF}\u{0000200D}\u{0000200D}\u{0001F9B2}',
      ['\u{0001F469}\u{0001F3FF}', '\u{0000200D}', '\u{0000200D}', '\u{0001F9B2}']],
      ["6️9", ["6", "\ufe0f", "9"]],
      ["️9", ["\ufe0f", "9"]],
      ["6️", ["6", "\ufe0f"]],
      ["🦄️", ["🦄️"]],
      ["🦄️️", ["🦄️", "\ufe0f"]],
      ["6‍9", ["6", "‍", "9"]],
      ["6‌9", ["6", "‌", "9"]],
      ["6‌‍️9", ["6", "‌", "‍", "\ufe0f", "9"]],
      ["a	  ­͏b", ["a", "\t", " ", "\xa0", "\xad", "͏", "b"]],
      ["a؜b", ["a", "\u061c", "b"]],
      ["a​b", ["a", "\u200b", "b"]],
      ["a\ufeffb", ["a", "\ufeff", "b"]],
      ["a\ufe0eb", ["a", "\ufe0e", "b"]],
      ["ᄅ", ["ᄅ"]],
      ["ᄅᄅ", ["ᄅ", "ᄅ"]],
      ["ᄅ\u0328", ["ᄅ\u0328"]],
      ["ᄅᄅ\u0328", ["ᄅ", "ᄅ\u0328"]],
    ];
    for (const [input, expected] of cases) {
      expect(splitGraphemes(input)).toStrictEqual(expected);
    }
  });
});
