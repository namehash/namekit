import { describe, it, expect } from "vitest";
import { createPublicClient, http } from "viem";
import { mainnet, sepolia } from "viem/chains";
import { createClient } from "./nameguard-js";

const PROVIDER_URI_MAINNET = process.env.PROVIDER_URI_MAINNET;
const PROVIDER_URI_SEPOLIA = process.env.PROVIDER_URI_SEPOLIA;

if (!PROVIDER_URI_MAINNET) {
  console.warn(
    "PROVIDER_URI_MAINNET is not defined. Defaulting to viem's default provider, which may have rate limiting and other performance limitations.",
  );
}

if (!PROVIDER_URI_SEPOLIA) {
  console.warn(
    "PROVIDER_URI_SEPOLIA is not defined. Defaulting to viem's default provider, which may have rate limiting and other performance limitations.",
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
    const localNameguard = createClient({
      // not a real endpoint, will error if used

      network: "mainnet",
    });

    const data = await localNameguard.getSecurePrimaryName(
      "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5",
    );

    expect(data.display_name).toBe("nick.eth");
  });

  it("should use the API for requests with a requested nameguard report", () => {
    const localNameguard = createClient({
      // not a real endpoint, will error if used
      network: "mainnet",
    });

    expect(
      // this should try to fetch from the endpoint
      localNameguard.getSecurePrimaryName(
        "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5",
        { computeNameGuardReport: true },
      ),
    ).rejects.toThrow(
      "request to http://localhost:1234/secure-primary-name/mainnet/0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5?return_nameguard_report=true failed",
    );
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
