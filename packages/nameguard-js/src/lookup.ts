import { PublicClient } from "viem";

/**
 * Looks up the primary name associated with the given address.
 *
 * @param address - The address to lookup.
 * @param client - The viem client instance used for the lookup.
 * @returns A Promise that resolves to the primary name associated with the address, or null if not found.
 */
export function lookupPrimaryName(
  address: string,
  client: PublicClient,
): Promise<string | null> {
  return client.getEnsName({ address });
}
