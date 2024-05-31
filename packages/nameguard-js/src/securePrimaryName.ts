import { ens_beautify, ens_normalize } from "@adraffy/ens-normalize";
import { PublicClient } from "viem";
import { SecurePrimaryNameResult } from "@namehash/nameguard";
import { computeImpersonationStatus } from "./impersonation";
import { lookupPrimaryName } from "./lookup";

export async function securePrimaryName(
  address: string,
  client: PublicClient,
): Promise<SecurePrimaryNameResult> {
  const primaryName = await lookupPrimaryName(address, client);
  const unnamedName = `Unnamed ${address.slice(2, 6).toLowerCase()}`;
  if (primaryName === null) {
    return {
      primaryName: null,
      impersonationStatus: null,
      displayName: unnamedName,
      primaryNameStatus: "no_primary_name",
    };
  }
  if (ens_normalize(primaryName) !== primaryName) {
    return {
      primaryName: null,
      impersonationStatus: null,
      displayName: unnamedName,
      primaryNameStatus: "unnormalized",
    };
  }
  const beautifulName = ens_beautify(primaryName);
  return {
    primaryName: primaryName,
    impersonationStatus: computeImpersonationStatus(primaryName),
    displayName: beautifulName,
    primaryNameStatus: "normalized",
  };
}
