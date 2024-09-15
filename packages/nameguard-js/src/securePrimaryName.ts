import { ens_beautify } from "@adraffy/ens-normalize";
import { PublicClient } from "viem";
import { SecurePrimaryNameResult } from "@namehash/nameguard";
import { computeImpersonationStatus } from "./impersonation";
import { lookupPrimaryName } from "./lookup";
import { isEnsNormalized } from "./normalization";

/**
 * Analyzes the primary name associated with an address to determine if it is a potential impersonation attempt.
 *
 * @param address - The address to analyze.
 * @param client - The viem client used to perform the primary name lookup.
 * @returns A promise that resolves to a `SecurePrimaryNameResult` object containing the analysis results.
 */
export async function securePrimaryName(
  address: string,
  client: PublicClient,
): Promise<SecurePrimaryNameResult> {
  const primaryName = await lookupPrimaryName(address, client);

  // This name is displayed when the primary name is not found.
  const unnamedName = `Unnamed ${address.slice(2, 6).toLowerCase()}`;

  // No primary name found.
  if (primaryName === null) {
    return {
      primary_name: null,
      impersonation_status: null,
      display_name: unnamedName,
      primary_name_status: "no_primary_name",
      nameguard_result: null,
    };
  }

  // Primary name is not normalized.
  if (!isEnsNormalized(primaryName)) {
    return {
      primary_name: null,
      impersonation_status: null,
      display_name: unnamedName,
      primary_name_status: "unnormalized",
      nameguard_result: null,
    };
  }

  // This name is displayed when the primary name is normalized.
  const beautifulName = ens_beautify(primaryName);

  return {
    primary_name: primaryName,
    // Only perform the impersonation check if the primary name is normalized.
    impersonation_status: computeImpersonationStatus(primaryName),
    display_name: beautifulName,
    primary_name_status: "normalized",
    nameguard_result: null,
  };
}
