import { describe, it, expect } from "vitest";
import { createClient } from "./nameguard-js";

let ENSNODE_URL_MAINNET = process.env.ENSNODE_URL_MAINNET;
let ENSNODE_URL_SEPOLIA = process.env.ENSNODE_URL_SEPOLIA;

if (!ENSNODE_URL_MAINNET) {
  console.warn(
    "ENSNODE_URL_MAINNET is not defined. Defaulting to https://api.alpha.ensnode.io.",
  );
  ENSNODE_URL_MAINNET = "https://api.alpha.ensnode.io";
}

if (!ENSNODE_URL_SEPOLIA) {
  console.warn(
    "ENSNODE_URL_SEPOLIA is not defined. Defaulting to https://api.alpha-sepolia.ensnode.io.",
  );
  ENSNODE_URL_SEPOLIA = "https://api.alpha-sepolia.ensnode.io";
}

/**
 * This is a fake endpoint that will not work.
 * If a client created with this endpoint tries to make an API request, it will throw an error.
 * This is used to prove that the secure primary name is computed locally.
 */
const INVALID_NAMEGUARD_API_ENDPOINT = "http://localhost:1234";

describe("NameGuardJS", () => {
  it("should compute secure primary name", async () => {
    const localNameguard = createClient({
      network: "mainnet",
    });

    const data = await localNameguard.getSecurePrimaryName(
      "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5",
    );

    expect(data.display_name).toBe("nick.eth");
  });

  it("should return nameguard report when requested", async () => {
    const nameguard = createClient({
      network: "mainnet",
    });

    const data = await nameguard.getSecurePrimaryName(
      "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5",
      { returnNameGuardReport: true },
    );

    expect(data.display_name).toBe("nick.eth");
    expect(data.nameguard_report).not.toBeNull();
    expect(data.nameguard_report).toBeDefined();
  });

  it("should throw an error when using client with wrong endpoint", async () => {
    const nameguard = createClient({
      nameguardEndpoint: INVALID_NAMEGUARD_API_ENDPOINT,
      network: "mainnet",
    });

    await expect(
      nameguard.getSecurePrimaryName(
        "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5",
        { returnNameGuardReport: true },
      ),
    ).rejects.toThrow(/request to .* failed/);
  });

  it("should support mainnet network", () => {
    expect(() => {
      createClient({
        network: "mainnet",
      });
    }).not.toThrow();
  });

  it("should support sepolia network", () => {
    expect(() => {
      createClient({
        network: "sepolia",
      });
    }).not.toThrow();
  });

  it("should throw an error for unsupported network", () => {
    expect(() => {
      createClient({
        network: "unsupported" as any,
      });
    }).toThrow("Unsupported network: unsupported. Only mainnet and sepolia are supported.");
  });
});
