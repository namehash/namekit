import { ImpersonationEstimate } from "@namehash/nameguard";
import { getNormalizedCanonicalLabel } from "./canonical";

const LABELHASH_REGEX = /^\[[0-9a-f]{64}\]$/;

/**
 * Checks if a given label is a valid labelhash.
 *
 * @param label - The label to check.
 * @returns `true` if the label is a valid labelhash, `false` otherwise.
 */
function isLabelhash(label: string): boolean {
  return LABELHASH_REGEX.test(label);
}

/**
 * Checks if a given name is likely to be an impersonation attempt.
 *
 * @param name - The name to analyze.
 * @returns The impersonation estimate for the given name.
 */
export function computeImpersonationEstimate(
  name: string,
): ImpersonationEstimate {
  // We do not need codepoint splitting here, as we only check for empty names.
  // If the name is empty, it has 0 labels and .split would return an array with one empty string.
  const labels = name.length === 0 ? [] : name.split(".");

  if (labels.some(isLabelhash)) {
    // We treat labelhashes as potential impersonation attempts.
    return "potential";
  }

  const canonicalLabels = labels.map(getNormalizedCanonicalLabel);
  if (canonicalLabels.includes(null)) {
    // If any label does not have a canonical form, the name might be an impersonation attempt.
    return "potential";
  }

  const canonicalName = canonicalLabels.join(".");
  // A name is safe if it is already in canonical form.
  return canonicalName === name ? "unlikely" : "potential";
}
