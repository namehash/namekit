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
