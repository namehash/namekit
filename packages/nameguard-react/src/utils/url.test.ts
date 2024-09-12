import { buildENSName } from "@namehash/ens-utils";
import { describe, it, expect } from "vitest";
import { defaultReportURLGenerator } from "./url";

describe("defaultNameGuardReportUrl", () => {
  it("returns default NameGuard report URL for notrab.eth", () => {
    const result = defaultReportURLGenerator(buildENSName("notrab.eth")).href;
    const expectedResult = "https://nameguard.io/inspect/notrab.eth";

    expect(result).toBe(expectedResult);
  });
  it("returns default NameGuard report URL for 🐈‍⬛.eth", () => {
    const result = defaultReportURLGenerator(buildENSName("🐈‍⬛.eth")).href;
    const expectedResult = `https://nameguard.io/inspect/%F0%9F%90%88%E2%80%8D%E2%AC%9B.eth`;

    expect(result).toBe(expectedResult);
  });
});
