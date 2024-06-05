import { describe, it, expect } from "vitest";

import { createClient } from "./index.js";

const nameguard = createClient({
  // undefined will default to the production endpoint
  endpoint: process.env.NAMEGUARD_TEST_ENDPOINT,
});

describe("NameGuard", () => {
  // No mocking (we should probably mock)
  // Test urlencoded

  it("should fetch the NameGuard report for a single name", async () => {
    const data = await nameguard.inspectName("notrab.eth");

    expect(data.name).toBe("notrab.eth");
  });

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

  it("should analyze a primary name", async () => {
    const data = await nameguard.getSecurePrimaryName(
      "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5",
    );

    expect(data.display_name).toBe("nick.eth");
  });

  it("should check a fake ENS name", async () => {
    const data = await nameguard.fakeEthNameCheck(
      "0x495f947276749ce646f68ac8c248420045cb7b5e",
      "61995921128521442959106650131462633744885269624153038309795231243542768648193",
      { title: "nick.eth" },
    );

    expect(data.status).toBe("impersonated_eth_name");
  });

  it("getSecurePrimaryName: normalized - unlikely impersonation", async () => {
    const data = await nameguard.getSecurePrimaryName(
      "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    );

    expect(data.primary_name_status).toBe("normalized");
    expect(data.impersonation_status).toBe("unlikely");
    expect(data.primary_name).toBe("vitalik.eth");
    expect(data.display_name).toBe("vitalik.eth");
    expect(data.nameguard_result).not.toBeNull();
    expect(data.nameguard_result?.name).toBe("vitalik.eth");
    expect(data.nameguard_result?.canonical_name).toBe("vitalik.eth");
  });

  it("getSecurePrimaryName: normalized - potential impersonation", async () => {
    const data = await nameguard.getSecurePrimaryName(
      "0x8Ae0e6dd8eACe27045d9e017C8Cf6dAa9D08C776",
    );

    expect(data.primary_name_status).toBe("normalized");
    expect(data.impersonation_status).toBe("potential");
    expect(data.primary_name).toBe("vitalìk.eth");
    expect(data.display_name).toBe("vitalìk.eth");
    expect(data.nameguard_result).not.toBeNull();
    expect(data.nameguard_result?.name).toBe("vitalìk.eth");
    expect(data.nameguard_result?.canonical_name).toBe("vitalik.eth");
  });

  it("getSecurePrimaryName: normalized - unlikely impersonation - offchain name", async () => {
    const data = await nameguard.getSecurePrimaryName(
      "0xFD9eE68000Dc92aa6c67F8f6EB5d9d1a24086fAd",
    );

    expect(data.primary_name_status).toBe("normalized");
    expect(data.impersonation_status).toBe("unlikely");
    expect(data.primary_name).toBe("exampleprimary.cb.id");
    expect(data.display_name).toBe("exampleprimary.cb.id");
    expect(data.nameguard_result).not.toBeNull();
    expect(data.nameguard_result?.name).toBe("exampleprimary.cb.id");
    expect(data.nameguard_result?.canonical_name).toBe("exampleprimary.cb.id");
  });

  it("getSecurePrimaryName: no primary name", async () => {
    const data = await nameguard.getSecurePrimaryName(
      "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96046",
    );

    expect(data.primary_name_status).toBe("no_primary_name");
    expect(data.impersonation_status).toBeNull();
    expect(data.primary_name).toBeNull();
    expect(data.display_name).toBe("Unnamed d8da");
    expect(data.nameguard_result).toBeNull();
  });

  it("getSecurePrimaryName: unnormalized", async () => {
    const data = await nameguard.getSecurePrimaryName(
      "0xfA9A134f997b3d48e122d043E12d04E909b11073",
    );

    expect(data.primary_name_status).toBe("unnormalized");
    expect(data.impersonation_status).toBeNull();
    expect(data.primary_name).toBeNull();
    expect(data.display_name).toBe("Unnamed fa9a");
    expect(data.nameguard_result).not.toBeNull();
    expect(data.nameguard_result?.name).toBe("888‍‍.eth");
    expect(data.nameguard_result?.canonical_name).toBeNull();
  });

  it("getSecurePrimaryName: unnormalized with canonical", async () => {
    const data = await nameguard.getSecurePrimaryName(
      "0xaf738F6C83d7D2C46723b727Ce794F9c79Cc47E6",
    );

    expect(data.primary_name_status).toBe("unnormalized");
    expect(data.impersonation_status).toBeNull();
    expect(data.primary_name).toBeNull();
    expect(data.display_name).toBe("Unnamed af73");
    expect(data.nameguard_result).not.toBeNull();
    expect(data.nameguard_result?.name).toBe("୨୨୨୨୨.eth");
    expect(data.nameguard_result?.canonical_name).toBeNull();
  });

  it("getSecurePrimaryName: unnormalized but normalizable", async () => {
    const data = await nameguard.getSecurePrimaryName(
      "0xf537a27F31d7A014c5b8008a0069c61f827fA7A1",
    );

    expect(data.primary_name_status).toBe("unnormalized");
    expect(data.impersonation_status).toBeNull();
    expect(data.primary_name).toBeNull();
    expect(data.display_name).toBe("Unnamed f537");
    expect(data.nameguard_result).not.toBeNull();
    expect(data.nameguard_result?.name).toBe("٠٠۱.eth");
    expect(data.nameguard_result?.canonical_name).toBeNull();
  });

  it("getSecurePrimaryName: normalized with different display_name", async () => {
    const data = await nameguard.getSecurePrimaryName(
      "0x7c7160A23b32402ad24ED5a617b8a83f434642d4",
    );

    expect(data.primary_name_status).toBe("normalized");
    expect(data.impersonation_status).toBe("unlikely");
    expect(data.primary_name).toBe("vincξnt.eth");
    expect(data.display_name).toBe("vincΞnt.eth");
    expect(data.nameguard_result).not.toBeNull();
    expect(data.nameguard_result?.name).toBe("vincξnt.eth");
    expect(data.nameguard_result?.canonical_name).toBe("vincξnt.eth");
  });

  it("getSecurePrimaryName: attempted code injection with primary name", async () => {
    const data = await nameguard.getSecurePrimaryName(
      "0x744Ec0A91D420c257aE3eE471B79B1A6a0312E36",
    );

    expect(data.primary_name_status).toBe("unnormalized");
    expect(data.impersonation_status).toBeNull();
    expect(data.primary_name).toBeNull();
    expect(data.display_name).toBe("Unnamed 744e");
    expect(data.nameguard_result).not.toBeNull();
    expect(data.nameguard_result?.name).toBe("hello<world>!.eth");
    expect(data.nameguard_result?.canonical_name).toBeNull();
  });
});
