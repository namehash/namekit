import { describe, it, expect } from "vitest";
import { ens_normalize } from "@adraffy/ens-normalize";
import { normalizeName } from "./normalizeName";
import { separateGraphemes } from "./separateGraphemes";
import jsonNamehashExamples from "../utils/normalized_graphemes.json";

const validInputNames = ["RaFFY🚴‍♂️.eTh"];

const invalidInputNames = ["‍420.eth"];

const validNamesExpectedOutputs = ["raffy🚴‍♂.eth"];

describe("normalizeName", () => {
    it("should return a name normalized to ENS standards", () => {
        for (const name_idx in validInputNames) {
            expect(normalizeName(validInputNames[name_idx])).toBe(validNamesExpectedOutputs[name_idx]);
        }
    });

    it("should throw an error when invalid name is provided", () => {
        for (const name of invalidInputNames) {
            expect(() => normalizeName(name)).toThrowError("Invalid name");
        }
    });
});


const grapehemeTestInputs = [
    '',
    'a',
    'abc',
    '🇪🇹',
    "\u{1F469}\u{1F3FF}\u{200D}\u{1F9B2}",
    "👩🏿‍🎓",
];

const graphemeTestOutputs = [
    [],
    ['a'],
    ['a', 'b', 'c'],
    ['🇪🇹'],
    ["\u{1F469}\u{1F3FF}\u{200D}\u{1F9B2}"],
    ["👩🏿‍🎓"],
];

type BreakClass = {
    symbol: string;
    breakOpportunity: boolean;
}

type UnicodeTestcase = {
    comment: string;
    codePoints: number[];
    possibleBreaks: BreakClass[];
}

const validateUnicodeTest = (graphemes: string[], breakOpportunities: BreakClass[]) => {
    const breakAtTheEnd = 1;

    const expectedNoGraphemes = breakOpportunities.reduce((acc, opportunity) => {
        if (opportunity.breakOpportunity) {
            return acc + 1;
        }
        return acc;
    }, 0) - breakAtTheEnd;

    expect(graphemes.length).toEqual(expectedNoGraphemes);
}

describe("separateGraphemes", () => {
    it("should separate example graphemes correctly", () => {
        expect(separateGraphemes("Hello 🌍! 👋")).toStrictEqual(["H", "e", "l", "l", "o", " ", "🌍", "!", " ", "👋"]);
    });

    it("should separate graphemes correctly", () => {
        for (const example_idx in grapehemeTestInputs) {
            expect(separateGraphemes(grapehemeTestInputs[example_idx])).toStrictEqual(graphemeTestOutputs[example_idx]);
        }
    });

    it("should separate graphemes the same as python version", async () => {
        for (const pair of jsonNamehashExamples) {
            expect(separateGraphemes(pair[0])).toStrictEqual(pair[1]);
        }
    });

    it("should work with hanguls", () => {
        expect(separateGraphemes("Helloᄀᄀᄀ 🌍! 👋")).toStrictEqual(["H", "e", "l", "l", "o","ᄀ", "ᄀ", "ᄀ", " ", "🌍", "!", " ", "👋"]);
    });

    it("should separate graphemes edge cases", () => {
        const cases = [
            ['', []],
            ['a', ['a']],
            ['abc', ['a', 'b', 'c']],
            ['a\u200db', ['a', '\u200d', 'b']],
            ['🇪🇹', ['🇪🇹']],
            // ['\U0001F469\U0001F3FF\U0000200D\U0001F9B2', ['\U0001F469\U0001F3FF\U0000200D\U0001F9B2']],
            // ['\U0001F469\U0001F3FF\U0000200D\U0000200D\U0001F9B2',
            //  ['\U0001F469\U0001F3FF', '\U0000200D', '\U0000200D', '\U0001F9B2']],
            ['6️9', ['6','\ufe0f','9']],
            ['️9', ['\ufe0f','9']],
            ['6️', ['6','\ufe0f']],
            ['🦄️', ['🦄️']],
            ['🦄️️', ['🦄️', '\ufe0f']],
            ['6‍9', ['6','‍','9']],
            ['6‌9', ['6','‌','9']],
            ['6‌‍️9', ['6','‌','‍','\ufe0f','9']],
            ['a	  ­͏b', ['a', '\t', ' ', '\xa0', '\xad', '͏', 'b']],
            ['a؜b', ['a', '\u061c', 'b']],
            ['a​b', ['a', '\u200b', 'b']],
            ['a\ufeffb', ['a', '\ufeff', 'b']],
            ['a\ufe0eb', ['a', '\ufe0e', 'b']],
            ['ᄅ', ['ᄅ']],
            ['ᄅᄅ', ['ᄅ', 'ᄅ']],
            ['ᄅ\u0328', ['ᄅ\u0328']],
            ['ᄅᄅ\u0328', ['ᄅ', 'ᄅ\u0328']],
        ];
        let i = 0;
        for (const [input, expected] of cases) {
            let ok = false;
            try {
                ok = ens_normalize(input) === input;
            } catch (ex) {}
            if (ok) {
                expect(separateGraphemes(input)).toStrictEqual(expected);
                i += 1;
            }
        }
        expect(i).toBeGreaterThan(0);
    });
});
