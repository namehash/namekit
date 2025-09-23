import { describe, it, expect, beforeAll } from "vitest";
import {
  isEmojiChar,
  isEmojiSequence,
  isEmojiZwjSequence,
  isEmoji,
  isCombiningChar,
} from "./utils";
import { initializeData } from "./data";

describe("isEmojiChar", () => {
  beforeAll(() => {
    initializeData();
  });

  it("should check if a character is an emoji", () => {
    const cases: [string, boolean][] = [
      ["🫶", true],
      ["😫", true],
      ["🤔", true],
      ["a", false],
      ["1", false],
      ["#", false],
      ["*", false],
      ["ア", false],
      ["\u{0000200D}", false], // ZWJ
      ["\u{0000200C}", false], // ZWNJ
      ["\u{0001FAB7}", true], // Unicode 14
      ["\u{0001B155}", false], // Unicode 15
      ["\u{0002000B}", false], // Unicode < 14 CJK
      ["\u{0002b736}", false], // Unicode 14 CJK
    ];
    for (const [chr, expected] of cases) {
      expect(isEmojiChar(chr)).toBe(expected);
    }
  });
});

describe("isEmojiSequence", () => {
  beforeAll(() => {
    initializeData();
  });

  it("should check if a string is an emoji sequence", () => {
    const cases: [string, boolean][] = [
      ["🇵🇱", true],
      ["🇺🇦", true],
      ["🇵🇱🇺🇦", false],
      ["🗂️", false], // has FE0F at the end
      ["🗂", true],
      ["♠️", false], // has FE0F at the end
      ["♠", true],
      ["🙃", true],
      ["🦹🏾", true],
      ["🦹", true],
    ];
    for (const [text, expected] of cases) {
      expect(isEmojiSequence(text)).toBe(expected);
    }
  });
});

describe("isEmojiZwjSequence", () => {
  beforeAll(() => {
    initializeData();
  });

  it("should check if a string is an emoji zwj sequence", () => {
    const cases: [string, boolean][] = [
      ["", false],
      ["a", false],
      ["\u2705", false], // single emoji
      ["🇪🇹", false], // RGI
      [
        "\u{0001F469}\u{0001F3FB}\u{0000200D}\u{0001F91D}\u{0000200D}\u{0001F469}\u{0001F3FC}",
        true,
      ],
      [
        "\u{0001F469}\u{0001F3FB}\u{0000200D}\u{0001F91D}\u{0000200D}\u{0000200D}\u{0001F469}\u{0001F3FC}",
        false,
      ], // 2 ZWJs
    ];
    for (const [text, expected] of cases) {
      expect(isEmojiZwjSequence(text)).toBe(expected);
    }
  });
});

describe("isEmoji", () => {
  beforeAll(() => {
    initializeData();
  });

  it("should check if a string is an emoji", () => {
    const cases: [string, boolean][] = [
      ["*️⃣", false],
      ["*⃣", true],
      ["*", false],
      ["*\ufe0f", false],
      ["🇪🇹", true],
      ["\u2705", true], // single emoji
      ["🇵🇱🇺🇦", false],
    ];
    for (const [text, expected] of cases) {
      expect(isEmoji(text)).toBe(expected);
    }
  });
});

describe("isCombiningChar", () => {
  it("should check if a character is a combining character", () => {
    // examples created with python's unicodedata.combining() function
    const nonCombining = [
      "\u{01c6b5}",
      "\u{040d07}",
      "\u{085ce7}",
      "\u{0f1877}",
      "\u{046173}",
      "\u{10f4c1}",
      "\u{055b7a}",
      "\u{06ac1e}",
      "\u{063027}",
      "\u{057c5c}",
    ];
    const combining = [
      "\u{000345}",
      "\u{01e014}",
      "\u{000822}",
      "\u{002dee}",
      "\u{01d16d}",
      "\u{00fe23}",
      "\u{01e133}",
      "\u{000e3a}",
      "\u{000d3b}",
      "\u{002dfa}",
    ];
    for (const chr of nonCombining) {
      expect(isCombiningChar(chr)).toBe(false);
    }
    for (const chr of combining) {
      expect(isCombiningChar(chr)).toBe(true);
    }
  });
});
