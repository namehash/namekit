import { describe, it, expect } from "vitest";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { createClient } from "@namehash/nameguard";
import { createLocalProvider } from "./localProvider";

describe("LocalProvider", () => {
  it("should be used by NameGuard", async () => {
    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(),
    });

    const localNameguard = createClient({
      // not a real endpoint
      endpoint: "http://localhost:1234",
      localProviders: new Map([
        ["mainnet", createLocalProvider({ publicClient })],
      ]),
    });

    const data = await localNameguard.getSecurePrimaryNameLocal(
      "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5",
    );

    expect(data.display_name).toBe("nick.eth");
  });

  it("should be rejected by NameGuard with a different network", () => {
    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(),
    });

    const localNameguard = createClient({
      // not a real endpoint
      endpoint: "http://localhost:1234",
      network: "sepolia",
      localProviders: new Map([
        ["mainnet", createLocalProvider({ publicClient })],
      ]),
    });

    expect(() => localNameguard.getSecurePrimaryNameLocal("0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5")).toThrow("Local provider for network sepolia is not configured.");
  });
});
