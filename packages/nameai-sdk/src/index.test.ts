import { describe, it, expect } from "vitest";

import { createClient, MAX_INSPECTED_NAME_CHARACTERS } from ".";

const nameai = createClient({
  // undefined will default to the production endpoint
  nameaiEndpoint: process.env.NAMERANK_API_URI,
});

// No mocking (we should probably mock)
// Test urlencoded

describe("inspectName", () => {
  it("should fetch the NameRank report for a single name", async () => {
    const data = await nameai.inspectName("vitalìk.eth");

    expect(data.nameai.purity_score).toBeCloseTo(0.28995870588235295, 2);
    expect(data.nameai.interesting_score).toBeCloseTo(0.3520927142857143, 2);
  });
});

describe("inspectName edge cases", () => {
  it("should handle names with special characters", async () => {
    const data = await nameai.inspectName("tést.eth");
    expect(data.nameai).toBeDefined();
    expect(data.nameguard).toBeDefined();
  });

  it("should handle very long names", async () => {
    const longName = "a".repeat(MAX_INSPECTED_NAME_CHARACTERS + 1) + ".eth";
    const data = await nameai.inspectName(longName);
    expect(data.nameai.purity_score).toBe(0);
    expect(data.nameai.interesting_score).toBe(0);
  });

  it("should handle empty name", async () => {
    const data = await nameai.inspectName("");
    expect(data.nameai).toBeDefined();
  });

  it("should handle names without TLD", async () => {
    const data = await nameai.inspectName("test");
    expect(data.nameai).toBeDefined();
  });

  it("should handle multi-level names", async () => {
    const data = await nameai.inspectName("sub.domain.eth");
    expect(data.nameai).toBeDefined();
  });
});

describe("NameAI constructor", () => {
  it("should ensure endpoint ends with trailing slash", () => {
    const client1 = createClient({
      nameaiEndpoint: "https://api.nameai.dev/nameai",
    });
    expect(client1["nameaiEndpoint"].href).toBe(
      "https://api.nameai.dev/nameai/",
    );

    const client2 = createClient({
      nameaiEndpoint: "https://api.nameai.dev/nameai/",
    });
    expect(client2["nameaiEndpoint"].href).toBe(
      "https://api.nameai.dev/nameai/",
    );
  });
});
