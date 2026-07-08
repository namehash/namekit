import { ens_beautify } from "@adraffy/ens-normalize";
import { SecurePrimaryNameResult } from "@namehash/nameguard";
import { computeImpersonationEstimate } from "./impersonation";
import { lookupPrimaryName } from "./lookup";

/**
 * Analyzes the primary name associated with an address to determine if it is a potential impersonation attempt.
 *
 * The ENSNode API only returns normalized primary names, so if a name is returned, it is guaranteed to be normalized.
 *
 * @param address - The address to analyze.
 * @param network - The network to query ("mainnet" or "sepolia").
 * @returns A promise that resolves to a `SecurePrimaryNameResult` object containing the analysis results.
 */
export async function securePrimaryName(
  address: string,
  network: "mainnet" | "sepolia",
): Promise<SecurePrimaryNameResult> {
  const primaryName = await lookupPrimaryName(address, network);

  // This name is displayed when the primary name is not found.
  const unnamedName = `Unnamed ${address.slice(2, 6).toLowerCase()}`;

  // No primary name found (or unnormalized primary name, which ENSNode API treats as no primary name).
  if (primaryName === null) {
    return {
      primary_name: null,
      impersonation_estimate: null,
      display_name: unnamedName,
      primary_name_status: "no_primary_name",
      nameguard_report: null,
    };
  }

  // ENSNode API only returns normalized names, so if we get here, the name is normalized.
  const beautifulName = ens_beautify(primaryName);

  return {
    primary_name: primaryName,
    // Only perform the impersonation check if the primary name is normalized.
    impersonation_estimate: computeImpersonationEstimate(primaryName),
    display_name: beautifulName,
    primary_name_status: "normalized",
    nameguard_report: null,
  };
}
