import { PublicClient } from "viem";

export function lookupPrimaryName(
  address: string,
  client: PublicClient,
): Promise<string | null> {
  return client.getEnsName({ address });
}
