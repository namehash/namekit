import { ens_normalize } from "@adraffy/ens-normalize";

/**
 * Checks if the given name is ENSIP-15 normalized.
 *
 * @param name - The name to check.
 * @returns A boolean indicating whether the name is normalized.
 */
export function isEnsNormalized(name: string): boolean {
  try {
    return name === ens_normalize(name);
  } catch {
    return false;
  }
}
