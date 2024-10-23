import { describe, it, expect } from "vitest";

import { createClient, MAX_INSPECTED_NAME_CHARACTERS } from ".";

const nameguard = createClient({
  // undefined will default to the production endpoint
  endpoint: process.env.NAMEGUARD_API_URI,
});

describe("NameGuard", () => {
  // No mocking (we should probably mock)
  // Test urlencoded

  it("should fetch the NameGuard report for a single name", async () => {
    const data = await nameguard.inspectName("notrab.eth");

    expect(data.name).toBe("notrab.eth");
    expect(data.inspected).toBe(true);
  });

  it("should fetch the UninspectedNameGuard report for a name that is too long", async () => {
    const name = "a".repeat(MAX_INSPECTED_NAME_CHARACTERS+1);
    const data = await nameguard.inspectName(name);

    expect(data.name).toBe(name);
    expect(data.inspected).toBe(false);
  });

  it("should fetch the consolidated NameGuard reports of multiple names", async () => {
    const data = await nameguard.bulkInspectNames([
      "notrab.eth",
      "vitalik.eth",
    ]);

    expect(data.results?.length).toBe(2);
    expect(data.results?.[0].inspected).toBe(true);
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
      { returnNameGuardReport: true },
    );

    expect(data.display_name).toBe("nick.eth");
    expect(data.nameguard_report).not.toBeNull();
  });

  it("should analyze a primary name and not include the nameguard_report", async () => {
    const data = await nameguard.getSecurePrimaryName(
      "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5",
      { returnNameGuardReport: false },
    );

    expect(data.display_name).toBe("nick.eth");
    expect(data.nameguard_report).toBeNull();
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
      { returnNameGuardReport: true },
    );

    expect(data.primary_name_status).toBe("normalized");
    expect(data.impersonation_status).toBe("unlikely");
    expect(data.primary_name).toBe("vitalik.eth");
    expect(data.display_name).toBe("vitalik.eth");
    expect(data.nameguard_report).not.toBeNull();
    expect(data.nameguard_report?.name).toBe("vitalik.eth");
    expect(data.nameguard_report?.canonical_name).toBe("vitalik.eth");
  });

  it("getSecurePrimaryName: normalized - potential impersonation", async () => {
    const data = await nameguard.getSecurePrimaryName(
      "0x8Ae0e6dd8eACe27045d9e017C8Cf6dAa9D08C776",
      { returnNameGuardReport: true },
    );

    expect(data.primary_name_status).toBe("normalized");
    expect(data.impersonation_status).toBe("potential");
    expect(data.primary_name).toBe("vitalìk.eth");
    expect(data.display_name).toBe("vitalìk.eth");
    expect(data.nameguard_report).not.toBeNull();
    expect(data.nameguard_report?.name).toBe("vitalìk.eth");
    expect(data.nameguard_report?.canonical_name).toBe("vitalik.eth");
  });

  it("getSecurePrimaryName: normalized - unlikely impersonation - offchain name", async () => {
    const data = await nameguard.getSecurePrimaryName(
      "0x9d32572997DA4948063E3Fc11c2552Eb82F7208E",
      { returnNameGuardReport: true },
    );

    expect(data.primary_name_status).toBe("normalized");
    expect(data.impersonation_status).toBe("unlikely");
    expect(data.primary_name).toBe("poet.base.eth");
    expect(data.display_name).toBe("poet.base.eth");
    expect(data.nameguard_report).not.toBeNull();
    expect(data.nameguard_report?.name).toBe("poet.base.eth");
    expect(data.nameguard_report?.canonical_name).toBe("poet.base.eth");
  });

  it("getSecurePrimaryName: no primary name", async () => {
    const data = await nameguard.getSecurePrimaryName(
      "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96046",
      { returnNameGuardReport: true },
    );

    expect(data.primary_name_status).toBe("no_primary_name");
    expect(data.impersonation_status).toBeNull();
    expect(data.primary_name).toBeNull();
    expect(data.display_name).toBe("Unnamed d8da");
    expect(data.nameguard_report).toBeNull();
  });

  it("getSecurePrimaryName: unnormalized", async () => {
    const data = await nameguard.getSecurePrimaryName(
      "0xfA9A134f997b3d48e122d043E12d04E909b11073",
      { returnNameGuardReport: true },
    );

    expect(data.primary_name_status).toBe("unnormalized");
    expect(data.impersonation_status).toBeNull();
    expect(data.primary_name).toBeNull();
    expect(data.display_name).toBe("Unnamed fa9a");
    expect(data.nameguard_report).not.toBeNull();
    expect(data.nameguard_report?.name).toBe("888‍‍.eth");
    expect(data.nameguard_report?.canonical_name).toBeNull();
  });

  it("getSecurePrimaryName: unnormalized with canonical", async () => {
    const data = await nameguard.getSecurePrimaryName(
      "0xaf738F6C83d7D2C46723b727Ce794F9c79Cc47E6",
      { returnNameGuardReport: true },
    );

    expect(data.primary_name_status).toBe("unnormalized");
    expect(data.impersonation_status).toBeNull();
    expect(data.primary_name).toBeNull();
    expect(data.display_name).toBe("Unnamed af73");
    expect(data.nameguard_report).not.toBeNull();
    expect(data.nameguard_report?.name).toBe("୨୨୨୨୨.eth");
    expect(data.nameguard_report?.canonical_name).toBeNull();
  });

  it("getSecurePrimaryName: unnormalized but normalizable", async () => {
    const data = await nameguard.getSecurePrimaryName(
      "0xf537a27F31d7A014c5b8008a0069c61f827fA7A1",
      { returnNameGuardReport: true },
    );

    expect(data.primary_name_status).toBe("unnormalized");
    expect(data.impersonation_status).toBeNull();
    expect(data.primary_name).toBeNull();
    expect(data.display_name).toBe("Unnamed f537");
    expect(data.nameguard_report).not.toBeNull();
    expect(data.nameguard_report?.name).toBe("٠٠۱.eth");
    expect(data.nameguard_report?.canonical_name).toBeNull();
  });

  it("getSecurePrimaryName: normalized with different display_name", async () => {
    const data = await nameguard.getSecurePrimaryName(
      "0x7c7160A23b32402ad24ED5a617b8a83f434642d4",
      { returnNameGuardReport: true },
    );

    expect(data.primary_name_status).toBe("normalized");
    expect(data.impersonation_status).toBe("unlikely");
    expect(data.primary_name).toBe("vincξnt.eth");
    expect(data.display_name).toBe("vincΞnt.eth");
    expect(data.nameguard_report).not.toBeNull();
    expect(data.nameguard_report?.name).toBe("vincξnt.eth");
    expect(data.nameguard_report?.canonical_name).toBe("vincξnt.eth");
  });

  it("getSecurePrimaryName: attempted code injection with primary name", async () => {
    const data = await nameguard.getSecurePrimaryName(
      "0x744Ec0A91D420c257aE3eE471B79B1A6a0312E36",
      { returnNameGuardReport: true },
    );

    expect(data.primary_name_status).toBe("unnormalized");
    expect(data.impersonation_status).toBeNull();
    expect(data.primary_name).toBeNull();
    expect(data.display_name).toBe("Unnamed 744e");
    expect(data.nameguard_report).not.toBeNull();
    expect(data.nameguard_report?.name).toBe("hello<world>!.eth");
    expect(data.nameguard_report?.canonical_name).toBeNull();
  });
});
