import { describe, it, expect } from "vitest";
import { createPublicClient, http } from "viem";
import { mainnet, sepolia } from "viem/chains";
import { createClient } from "./nameguard-js";

const PROVIDER_URI_MAINNET = process.env.PROVIDER_URI_MAINNET;
const PROVIDER_URI_SEPOLIA = process.env.PROVIDER_URI_SEPOLIA;

if (!PROVIDER_URI_MAINNET) {
  throw new Error(
    "The PROVIDER_URI_MAINNET environment variable is not defined.",
  );
}

if (!PROVIDER_URI_SEPOLIA) {
  throw new Error(
    "The PROVIDER_URI_SEPOLIA environment variable is not defined.",
  );
}

/**
 * This is a fake endpoint that will not work.
 * If a client created with this endpoint tries to make an API request, it will throw an error.
 * This is used to prove that the secure primary name is computed locally.
 */
const INVALID_NAMEGUARD_API_ENDPOINT = "http://localhost:1234";

describe("NameGuardJS", () => {
  it("should compute secure primary name", async () => {
    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(PROVIDER_URI_MAINNET),
    });

    const localNameguard = createClient({
      // not a real endpoint, will error if used
      endpoint: INVALID_NAMEGUARD_API_ENDPOINT,
      publicClient,
    });

    const data = await localNameguard.getSecurePrimaryName(
      "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5",
    );

    expect(data.display_name).toBe("nick.eth");
  });

  it("should use the API for requests with a requested nameguard report", () => {
    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(PROVIDER_URI_MAINNET),
    });

    const localNameguard = createClient({
      // not a real endpoint, will error if used
      endpoint: INVALID_NAMEGUARD_API_ENDPOINT,
      publicClient
    });

    expect(
      // this should try to fetch from the endpoint
      localNameguard.getSecurePrimaryName(
        "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5",
        { computeNameGuardReport: true }
      )
    ).rejects.toThrow("request to http://localhost:1234/secure-primary-name/mainnet/0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5 failed");
  });

  it("should throw an error for network mismatch on mainnet", () => {
    const sepoliaClient = createPublicClient({
      chain: sepolia,
      transport: http(PROVIDER_URI_SEPOLIA),
    });

    expect(() => {
      createClient({
        network: "mainnet",
        publicClient: sepoliaClient,
      });
    }).toThrow("Network mismatch: expected mainnet (chain id 1), but got chain id 11155111.");
  });

  it("should throw an error for network mismatch on sepolia", () => {
    const mainnetClient = createPublicClient({
      chain: mainnet,
      transport: http(PROVIDER_URI_MAINNET),
    });

    expect(() => {
      createClient({
        network: "sepolia",
        publicClient: mainnetClient,
      });
    }).toThrow("Network mismatch: expected sepolia (chain id 11155111), but got chain id 1.");
  });

  it("should not throw an error for correct network on mainnet", () => {
    const mainnetClient = createPublicClient({
      chain: mainnet,
      transport: http(PROVIDER_URI_MAINNET),
    });

    expect(() => {
      createClient({
        network: "mainnet",
        publicClient: mainnetClient,
      });
    }).not.toThrow();
  });

  it("should not throw an error for correct network on sepolia", () => {
    const sepoliaClient = createPublicClient({
      chain: sepolia,
      transport: http(PROVIDER_URI_SEPOLIA),
    });

    expect(() => {
      createClient({
        network: "sepolia",
        publicClient: sepoliaClient,
      });
    }).not.toThrow();
  });
});
