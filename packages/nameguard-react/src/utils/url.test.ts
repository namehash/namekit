import { buildENSName } from "@namehash/ens-utils";
import { describe, it, expect } from "vitest";
import { viewNameReportURL } from "./url";

describe("viewNameReportURL", () => {
  it("should return correct NameGuard inspect name page URL for notrab.eth", () => {
    const result = viewNameReportURL(buildENSName("notrab.eth")).href;
    const expectedResult = "https://nameguard.io/inspect/notrab.eth";

    expect(result).toBe(expectedResult);
  });
  it("should return correct NameGuard inspect name page URL for 🐈‍⬛.eth", () => {
    const result = viewNameReportURL(buildENSName("🐈‍⬛.eth")).href;
    const expectedResult = `https://nameguard.io/inspect/%F0%9F%90%88%E2%80%8D%E2%AC%9B.eth`;

    expect(result).toBe(expectedResult);
  });
});
