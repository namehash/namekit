import { PublicClient } from "viem";
import { SecurePrimaryNameResult } from "@namehash/nameguard";
import { securePrimaryName } from "./securePrimaryName";

interface LocalProviderOptions {
  publicClient: PublicClient;
}

class LocalProvider {
  private publicClient: PublicClient;

  constructor(options: LocalProviderOptions) {
    this.publicClient = options.publicClient;
  }

  securePrimaryName(address: string): Promise<SecurePrimaryNameResult> {
    return securePrimaryName(address, this.publicClient);
  }
}

export function createLocalProvider(options: LocalProviderOptions): LocalProvider {
  return new LocalProvider(options);
}
