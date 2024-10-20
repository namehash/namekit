import { describe, it, expect, beforeAll } from "vitest";
import { isGraphemeConfusable, getCanonical } from "./confusables";
import { initializeData } from "./data";

describe("confusables", () => {
  beforeAll(() => {
    initializeData();
  });

  it("should check if ASCII is confusable", () => {
    expect(isGraphemeConfusable("a")).toBe(false);
    expect(isGraphemeConfusable("A")).toBe(true);
    expect(isGraphemeConfusable("0")).toBe(false);
    expect(isGraphemeConfusable("9")).toBe(false);
    expect(isGraphemeConfusable("-")).toBe(false);
    expect(isGraphemeConfusable("_")).toBe(false);
    expect(isGraphemeConfusable("$")).toBe(false);
  });

  it("should check basic confusables", () => {
    expect(isGraphemeConfusable("ą")).toBe(true);
    expect(isGraphemeConfusable("𝕒")).toBe(true);
    expect(isGraphemeConfusable("𝖆")).toBe(true);
    expect(isGraphemeConfusable("𝗮")).toBe(true);
    expect(isGraphemeConfusable("𝘢")).toBe(true);
    expect(isGraphemeConfusable("𝙖")).toBe(true);
    expect(isGraphemeConfusable("𝚊")).toBe(true);
  });

  it("should check graphemes with combining marks", () => {
    expect(isGraphemeConfusable("b\u0328")).toBe(true);
    expect(isGraphemeConfusable("b\u0329")).toBe(true);
  });

  it("should find canonicals", () => {
    const cases = [
      ["ą", true, "a"],
      ["ś", true, "s"],
      ["ó", true, "o"],
      ["ź", true, "z"],
      ["ł", true, "l"],
      ["ώ", true, "ῴ"],
      ["ῴ", true, "ω"],
      ["𝕤", true, "s"],
      ["s", false, null],
      ["1", false, null],
      ["l", false, null],
      ["⒀", true, "(l3)"],
      ["-", false, null],
      ["_", false, null],
      ["👩🏿‍🦰", true, "🧑"],
      ["👩🏿", true, "🧑"],
      ["👩‍🦰", true, "🧑"],
      ["👩", true, "🧑"],
      ["🏃‍♂", true, "🏃"],
      ["🏃‍♂️", false, null],
      ["👩🏿‍🚒", true, "🧑‍🚒"],
      ["🫱🏻‍🫲🏿", true, "🤝"],
      ["🤜🏿", true, "🤜"],
      ['*⃣', false, null],
      ["🇺🇦", false, null],
      ["🏴󠁧󠁢󠁷󠁬󠁳󠁿", false, null],
      ["⛹🏽", true, "⛹"],
      ["🎅🏿", true, "🎅"],
      ["🧝🏼", true, "🧝"],
      ["ဩ", true, "သြ"],
      ["¤", false, "¤"],
      ["ą", true, "a"],
      ["s", false, null],
      ["👩‍🦰", true, "🧑"],
      ["👩", true, "🧑"],
      ["a", false, null],
      ["b\u0328", true, "b"],
      ["b\u0329", true, "b"],
      ["f̡̨̢̝̭͓̖͉͐͐́̎̇ͪ̚", true, "f"],
      ["🫱🏻‍🫲🏿", true, "🤝"],
      ["🤜🏿", true, "🤜"],
      ['*⃣', false, null],
      ["🇺🇦", false, null],
      ["¢", true, "¢"],
      ["¥", true, "¥"],
      ["η", true, "η"],
      ["ΐ", true, "ι"],
      ["ά", true, "α"],
      ["ΰ", true, "υ"],
      ["ό", true, "ο"],
      ["’", true, "’"],
      ["٠", true, "٠"],
      ["٩", true, "٩"],
      ["٧", true, "٧"],
    ];
    for (const [grapheme, isConfusable, canonical] of cases) {
      expect(isGraphemeConfusable(grapheme as string)).toBe(isConfusable);
      if (isConfusable) {
        expect(getCanonical(grapheme as string)).toBe(canonical);
      }
    }
  });
});
