import {
  NameGuard,
  SecurePrimaryNameOptions,
  SecurePrimaryNameResult,
  NameGuardOptions,
  DEFAULT_RETURN_NAMEGUARD_REPORT,
} from "@namehash/nameguard";
import { securePrimaryName as securePrimaryNameImpl } from "./securePrimaryName";
import { initializeData } from "./data";

export interface NameGuardJSOptions extends NameGuardOptions {
  // No additional required options - uses ENS node API directly instead of nameguardEndpoint
}

class NameGuardJS extends NameGuard {
  constructor(options: NameGuardJSOptions) {
    super(options);

    // Validate that the network is supported
    if (this.network !== "mainnet" && this.network !== "sepolia") {
      throw new Error(`Unsupported network: ${this.network}. Only mainnet and sepolia are supported.`);
    }

    // This class is the only public interface to the data, so we initialize it here.
    initializeData();
  }

  public override getSecurePrimaryName(
    address: string,
    options?: SecurePrimaryNameOptions,
  ): Promise<SecurePrimaryNameResult> {
    const returnNameGuardReport =
      options?.returnNameGuardReport || DEFAULT_RETURN_NAMEGUARD_REPORT;
    if (returnNameGuardReport) {
      return super.getSecurePrimaryName(address, options);
    }
    return securePrimaryNameImpl(address, this.network as "mainnet" | "sepolia");
  }
}

export function createClient(options: NameGuardJSOptions): NameGuard {
  return new NameGuardJS(options);
}
