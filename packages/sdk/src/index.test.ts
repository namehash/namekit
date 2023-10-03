import { describe, it, expect } from "vitest";

import { nameguard } from ".";

describe("NameGuard", () => {
  // Silly tests
  // No mocking (we should probably mock)
  // Test urlencoded

  // This is a dumb test
  it("should fetch a single name", async () => {
    const data = await nameguard.name("notrab.eth");

    expect(data.name).toBe("notrab.eth");
  });

  // I'm so lazy right now but this works
  it("should fetch multiple names", async () => {
    const data = await nameguard.name(["notrab.eth", "vitalik.eth"]);

    expect(data.results?.length).toBe(2);
  });
});
