import { describe, it, expect } from "vitest";

import { nameguard } from ".";

describe("NameGuard", () => {
  // Silly tests
  // No mocking (we should probably mock)
  // Test urlencoded

  // This is a dumb test
  it("should fetch the NameGuard report for a single name", async () => {
    const data = await nameguard.inspectName("notrab.eth");

    expect(data.name).toBe("notrab.eth");
  });

  // I'm so lazy right now but this works
  it("should fetch the summarized NameGuard reports of multiple names", async () => {
    const data = await nameguard.bulkInspectNames([
      "notrab.eth",
      "vitalik.eth",
    ]);

    expect(data.results?.length).toBe(2);
  });

  it("should throw an error if invalid namehash provided", async () => {
    await expect(
      nameguard.inspectNamehash("0x1234567890abcdef")
    ).rejects.toThrow("Invalid Keccak256 hash format for namehash.");
  });

  it("should throw an error if invalid labelhash provided", async () => {
    await expect(
      nameguard.inspectLabelhash("0x1234567890abcdef")
    ).rejects.toThrow("Invalid Keccak256 hash format for labelhash.");
  });
});
