import { PublicClient } from "viem";
import {
  NameGuard,
  SecurePrimaryNameOptions,
  SecurePrimaryNameResult,
  Network,
} from "@namehash/nameguard";
import { securePrimaryName as securePrimaryNameImpl } from "./securePrimaryName";

export interface NameGuardJSOptions {
  endpoint?: string;
  network?: Network;
  publicClient?: PublicClient;
}

class NameGuardJS extends NameGuard {
  private publicClient: PublicClient;

  constructor(options: NameGuardJSOptions) {
    super(options);
    if (options.publicClient === undefined) {
      throw new Error("publicClient is required");
    }
    this.publicClient = options.publicClient;
  }

  public override getSecurePrimaryName(
    address: string,
    options?: SecurePrimaryNameOptions
  ): Promise<SecurePrimaryNameResult> {
    const computeNameGuardReport = options?.computeNameGuardReport || false;
    const network_name = options?.network || this.network;
    if (network_name !== this.network || computeNameGuardReport) {
      return super.getSecurePrimaryName(address, options);
    }
    return securePrimaryNameImpl(address, this.publicClient);
  }
}

export function createClient(options: NameGuardJSOptions): NameGuardJS {
  return new NameGuardJS(options);
}
