import { describe, it, expect } from "vitest";
import { isEmojiChar, isEmojiSequence, isEmojiZwjSequence, isEmoji } from "./utils";

describe("isEmojiChar", () => {
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
      expect(isEmojiChar(chr)).toBe(expected)
    }
  });
});

describe("isEmojiSequence", () => {
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
      expect(isEmojiSequence(text)).toBe(expected)
    }
  });
});

describe("isEmojiZwjSequence", () => {
  it("should check if a string is an emoji zwj sequence", () => {
    const cases: [string, boolean][] = [
      ["", false],
      ["a", false],
      ["\u2705", false], // single emoji
      ["🇪🇹", false], // RGI
      ["\u{0001F469}\u{0001F3FB}\u{0000200D}\u{0001F91D}\u{0000200D}\u{0001F469}\u{0001F3FC}", true],
      ["\u{0001F469}\u{0001F3FB}\u{0000200D}\u{0001F91D}\u{0000200D}\u{0000200D}\u{0001F469}\u{0001F3FC}", false], // 2 ZWJs
    ];
    for (const [text, expected] of cases) {
      expect(isEmojiZwjSequence(text)).toBe(expected)
    }
  });
});

describe("isEmoji", () => {
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
      expect(isEmoji(text)).toBe(expected)
    }
  });
});
