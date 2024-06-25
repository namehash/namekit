import { PublicClient } from "viem";
import { LocalSecurePrimaryNameResult, NameGuardLocalProvider } from "@namehash/nameguard";
import { securePrimaryName as securePrimaryNameImpl } from "./securePrimaryName";

/**
 * Options for the NameGuard LocalProvider constructor.
 */
export interface LocalProviderOptions {
  /**
   * The viem client instance to use for primary name lookups.
   * The network of this client must match the network declared in NameGuard's `createClient` options.
   *
   * ```typescript
   * const nameguard = createClient({
   *   localProviders: new Map([
   *     // The network of the publicClient must match the network declared here.
   *     ["mainnet", createLocalProvider({ publicClient })],
   *     ["sepolia", ...],
   *   ]),
   * });
   * ```
   *
   * It is the user's responsibility to ensure that the network of the viem client matches the declared network.
   */
  publicClient: PublicClient;
}

class LocalProviderImpl {
  private publicClient: PublicClient;

  constructor(options: LocalProviderOptions) {
    this.publicClient = options.publicClient;
  }

  securePrimaryName(address: string): Promise<LocalSecurePrimaryNameResult> {
    return securePrimaryNameImpl(address, this.publicClient);
  }
}

/**
 * Creates a NameGuard local provider instance.
 * This provider can be passed to the NameGuard constructor to enable client-side analysis.
 *
 * @param options - The options for the local provider.
 * @returns A new instance of the local provider.
 */
export function createLocalProvider(options: LocalProviderOptions): NameGuardLocalProvider {
  return new LocalProviderImpl(options);
}
