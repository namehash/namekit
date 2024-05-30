import { ens_normalize } from "@adraffy/ens-normalize";

/**
 * Takes a name and normalizes it to ENS standards. Throws on invalid names.
 * @param name - potential domain name to be normalized to ENS standards
 * @returns - output ready for namehash
 */
export function normalizeName(name: string): string {
  try {
    return ens_normalize(name);
  } catch {
    throw new Error("Invalid name");
  }
}
