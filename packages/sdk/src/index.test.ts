import { describe, it, expect } from "vitest";

import { createClient } from ".";

const nameguard = createClient({
  // undefined will default to the production endpoint
  endpoint: process.env.NAMEGUARD_TEST_ENDPOINT,
});

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
  it("should fetch the consolidated NameGuard reports of multiple names", async () => {
    const data = await nameguard.bulkInspectNames([
      "notrab.eth",
      "vitalik.eth",
    ]);

    expect(data.results?.length).toBe(2);
  });

  it("should throw an error if invalid namehash provided", async () => {
    await expect(
      nameguard.inspectNamehash("0x1234567890abcdef"),
    ).rejects.toThrow("Invalid Keccak256 hash format for namehash.");
  });

  it("should throw an error if invalid labelhash provided", async () => {
    await expect(
      nameguard.inspectLabelhash("0x1234567890abcdef"),
    ).rejects.toThrow("Invalid Keccak256 hash format for labelhash.");
  });

  it("should analyze a single grapheme", async () => {
    const data = await nameguard.inspectGrapheme("ą");

    expect(data.grapheme).toBe("ą");
    expect(data.canonical_grapheme).toBe("a");
  });

  // TODO: lambda does not have the API key set up
  // it("should analyze a primary name", async () => {
  //   const data = await nameguard.primaryName("0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5");

  //   expect(data.display_name).toBe("nick.eth");
  // });

  // TODO: lambda does not have the API key set up
  // it("should check a fake ENS name", async () => {
  //   const data = await nameguard.fakeEnsNameCheck(
  //     "0x495f947276749ce646f68ac8c248420045cb7b5e",
  //     "61995921128521442959106650131462633744885269624153038309795231243542768648193"
  //   );

  //   expect(data).toBe("impersonated_ens_name");
  // });
});
