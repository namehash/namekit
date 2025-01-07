import { describe, it, expect } from "vitest";

import { createClient, MAX_INSPECTED_NAME_CHARACTERS } from ".";

const namerank = createClient({
  // undefined will default to the production endpoint
  namerankEndpoint: process.env.NAMERANK_API_URI,
});

// No mocking (we should probably mock)
// Test urlencoded

describe("inspectName", () => {
  it("should fetch the NameRank report for a single name", async () => {
    const data = await namerank.inspectName("vitalìk.eth");

    expect(data.namerank.purity_score).toBeCloseTo(0.28995870588235295, 2);
    expect(data.namerank.interesting_score).toBeCloseTo(0.3520927142857143, 2);
  });
});


describe("inspectName edge cases", () => {
  it("should handle names with special characters", async () => {
    const data = await namerank.inspectName("tést.eth");
    expect(data.namerank).toBeDefined();
    expect(data.nameguard).toBeDefined();
  });

  it("should handle very long names", async () => {
    const longName = "a".repeat(MAX_INSPECTED_NAME_CHARACTERS + 1) + ".eth";
    const data = await namerank.inspectName(longName);
    expect(data.namerank.purity_score).toBe(0);
    expect(data.namerank.interesting_score).toBe(0);
  });

  it("should handle empty name", async () => {
    const data = await namerank.inspectName("");
    expect(data.namerank).toBeDefined();
  });

  it("should handle names without TLD", async () => {
    const data = await namerank.inspectName("test");
    expect(data.namerank).toBeDefined();
  });

  it("should handle multi-level names", async () => {
    const data = await namerank.inspectName("sub.domain.eth");
    expect(data.namerank).toBeDefined();
  });
});


describe("NameRank constructor", () => {
  it("should ensure endpoint ends with trailing slash", () => {
    const client1 = createClient({
      namerankEndpoint: "https://api.namerank.io/namerank"
    });
    expect(client1["namerankEndpoint"].href).toBe("https://api.namerank.io/namerank/");

    const client2 = createClient({
      namerankEndpoint: "https://api.namerank.io/namerank/"
    });
    expect(client2["namerankEndpoint"].href).toBe("https://api.namerank.io/namerank/");
  });
});
