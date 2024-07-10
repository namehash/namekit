import { describe, it, expect } from "vitest";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { createClient } from "./nameguard-js";

const PROVIDER_URI_MAINNET = process.env.PROVIDER_URI_MAINNET;

describe("NameGuardJS", () => {
  it("should compute secure primary name", async () => {
    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(PROVIDER_URI_MAINNET),
    });

    const localNameguard = createClient({
      // not a real endpoint, will error if used
      endpoint: "http://localhost:1234",
      publicClient,
    });

    const data = await localNameguard.getSecurePrimaryName(
      "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5",
    );

    expect(data.display_name).toBe("nick.eth");
  });

  it("should use the API for requests with a different network", () => {
    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(PROVIDER_URI_MAINNET),
    });

    const localNameguard = createClient({
      // not a real endpoint, will error if used
      endpoint: "http://localhost:1234",
      network: "sepolia",
      publicClient
    });

    expect(
      // this should try to fetch from the endpoint
      localNameguard.getSecurePrimaryName(
        "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5",
        { network: "mainnet" }
      )
    ).rejects.toThrow("fetch failed");
  });

  it("should use the API for requests with a requested nameguard report", () => {
    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(PROVIDER_URI_MAINNET),
    });

    const localNameguard = createClient({
      // not a real endpoint, will error if used
      endpoint: "http://localhost:1234",
      publicClient
    });

    expect(
      // this should try to fetch from the endpoint
      localNameguard.getSecurePrimaryName(
        "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5",
        { computeNameGuardReport: true }
      )
    ).rejects.toThrow("fetch failed");
  });
});
