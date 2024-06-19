import { PublicClient } from "viem";
import { SecurePrimaryNameResult } from "@namehash/nameguard";
import { securePrimaryName } from "./securePrimaryName";

/**
 * Options for the NameGuard LocalProvider constructor.
 */
interface LocalProviderOptions {
  /**
   * The viem client instance to use for primary name lookups.
   * The network of this client must match the network of the NameGuard client.
   */
  publicClient: PublicClient;
}

/**
 * Implements a client-side analysis provider for NameGuard.
 * This provider can be passed to the NameGuard constructor to enable client-side analysis.
 * Requires a viem client instance to perform primary name lookups.
 */
class LocalProvider {
  /**
   * The viem client instance to use for primary name lookups.
   * The network of this client must match the network of the NameGuard client.
   */
  private publicClient: PublicClient;

  /**
   * Creates an instance of the LocalProvider.
   * @param options - The options for configuring the local provider.
   */
  constructor(options: LocalProviderOptions) {
    this.publicClient = options.publicClient;
  }

  /**
   * Implements the NameGuard securePrimaryName method without using a NameGuard API server.
   *
   * @param address - The address for which to secure the primary name.
   * @returns A promise that resolves to the result of securing the primary name.
   */
  securePrimaryName(address: string): Promise<SecurePrimaryNameResult> {
    return securePrimaryName(address, this.publicClient);
  }
}

/**
 * Creates a NameGuard local provider instance.
 * This provider can be passed to the NameGuard constructor to enable client-side analysis.
 *
 * @param options - The options for the local provider.
 * @returns A new instance of the local provider.
 */
export function createLocalProvider(options: LocalProviderOptions): LocalProvider {
  return new LocalProvider(options);
}
