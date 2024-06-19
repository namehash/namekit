import { describe, it, expect } from "vitest";
import { checkGraphemeConfusable, getCanonical } from "./confusables";

describe("confusables", () => {
  it("should check if ASCII is confusable", () => {
    expect(checkGraphemeConfusable("a")).toBe(false);
    expect(checkGraphemeConfusable("A")).toBe(true);
    expect(checkGraphemeConfusable("0")).toBe(false);
    expect(checkGraphemeConfusable("9")).toBe(false);
    expect(checkGraphemeConfusable("-")).toBe(false);
    expect(checkGraphemeConfusable("_")).toBe(false);
    expect(checkGraphemeConfusable("$")).toBe(false);
  });

  it("should check basic confusables", () => {
    expect(checkGraphemeConfusable("ą")).toBe(true);
    expect(checkGraphemeConfusable("𝕒")).toBe(true);
    expect(checkGraphemeConfusable("𝖆")).toBe(true);
    expect(checkGraphemeConfusable("𝗮")).toBe(true);
    expect(checkGraphemeConfusable("𝘢")).toBe(true);
    expect(checkGraphemeConfusable("𝙖")).toBe(true);
    expect(checkGraphemeConfusable("𝚊")).toBe(true);
  });

  it("should check graphemes with combining marks", () => {
    expect(checkGraphemeConfusable("b\u0328")).toBe(true);
    expect(checkGraphemeConfusable("b\u0329")).toBe(true);
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
      expect(checkGraphemeConfusable(grapheme as string)).toBe(isConfusable);
      if (isConfusable) {
        expect(getCanonical(grapheme as string)).toBe(canonical);
      }
    }
  });
});
