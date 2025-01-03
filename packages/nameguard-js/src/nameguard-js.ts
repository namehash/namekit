import { PublicClient } from "viem";
import {
  NameGuard,
  SecurePrimaryNameOptions,
  SecurePrimaryNameResult,
  NameGuardOptions,
  DEFAULT_COMPUTE_NAMEGUARD_REPORT,
} from "@namehash/nameguard";
import { securePrimaryName as securePrimaryNameImpl } from "./securePrimaryName";
import { initializeData } from "./data";

export interface NameGuardJSOptions extends NameGuardOptions {
  publicClient: PublicClient;
}

class NameGuardJS extends NameGuard {
  private publicClient: PublicClient;

  constructor(options: NameGuardJSOptions) {
    super(options);

    this.publicClient = options.publicClient;

    // Validate that the public client is connected to the correct network
    const chainId = this.publicClient.chain?.id;
    if (this.network === "mainnet" && chainId !== 1) {
      throw new Error(
        `Network mismatch: expected mainnet (chain id 1), but got chain id ${chainId}.`,
      );
    } else if (this.network === "sepolia" && chainId !== 11155111) {
      throw new Error(
        `Network mismatch: expected sepolia (chain id 11155111), but got chain id ${chainId}.`,
      );
    } else if (this.network !== "mainnet" && this.network !== "sepolia") {
      throw new Error(`Unsupported network: ${this.network}.`);
    }

    // This class is the only public interface to the data, so we initialize it here.
    initializeData();
  }

  public override getSecurePrimaryName(
    address: string,
    options?: SecurePrimaryNameOptions,
  ): Promise<SecurePrimaryNameResult> {
    const returnNameGuardReport =
      options?.returnNameGuardReport || DEFAULT_COMPUTE_NAMEGUARD_REPORT;
    if (returnNameGuardReport) {
      return super.getSecurePrimaryName(address, options);
    }
    return securePrimaryNameImpl(address, this.publicClient);
  }
}

export function createClient(options: NameGuardJSOptions): NameGuard {
  return new NameGuardJS(options);
}
