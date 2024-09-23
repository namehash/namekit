import { ens_beautify, ens_normalize } from "@adraffy/ens-normalize";
import {
  encodeLabelhash,
  isEncodedLabelhash,
  labelhash,
  normalizeEncodedLabelhash,
} from "./hashutils";
import { namehash } from "viem";

export const LABEL_SEPARATOR = ".";
export const ETH_TLD = "eth";
export const MIN_ETH_REGISTRABLE_LABEL_LENGTH = 3;

/**
 * The ENSIP-15 normalization status of a name/label.
 *
 * If a label is in the format "[labelhash]" then the `Normalization` of the label is considered to be `unknown`.
 * If a name contains any label that is `unnormalized` then the `Normalization` of the entire name is considered to be `unnormalized`.
 * If a name contains no `unnormalized` labels but 1 or more `unknown` labels then the entire name is considered to be `unknown`.
 * A name is `normalized` if and only if all of its labels are `normalized`.
 */
export const Normalization = {
  /** `normalized`: The name or label is normalized. */
  Normalized: 'normalized',

  /** `unnormalized`: The name or label is not normalized. */
  Unnormalized: 'unnormalized',

  /** `unknown`: The name or label is unknown because it cannot be looked up from its hash. */
  Unknown: 'unknown',
} as const;

export type Normalization = (typeof Normalization)[keyof typeof Normalization];

export type NamespaceRoot =
  | "ens" /** For now: Only given to names ending in "eth" and the ENS root */
  | "dns"
  | "unknown"; /** For now: Used for all other cases. Future enhancements will make this more specific. */

export type RegistrationPotential =
  | "unregisterable" /** For now: Only given to direct subnames of .eth that are not long enough for current ETHRegistrarController contracts */
  | "invalid" /** Invalid names are technically registerable, but are unnormalized and should not be registered. */
  | "registerable"
  | "unknown"; /** For now: Used for all other cases. Future enhancements will make this more specific. */

export type DecentralizationStatus =
  | "unruggable" /** For now: Only given to direct subnames of .eth, the name "eth", and the ENS root. */
  | "icann"
  | "unknown"; /** For now: Used for all other cases. Future enhancements will make this more specific. */

/**
 * An ENS name.
 */
export interface ENSName {
  /**
   * The actual name value.
   */
  name: string;

  /**
   * Each of the labels in `name`.
   */
  labels: string[];

  /**
   * The `name` as processed by `getSaferDisplayName`.
   */
  displayName: string;

  /**
   * Each of the labels in `displayName`.
   */
  displayLabels: string[];

  /**
   * The normalization status of `name`.
   */
  normalization: Normalization;

  /**
   * The node of `name` as calculated by the `namehash` function.
   */
  node: `0x${string}`;
}

/**
 * Compares two sets of labels for deep equality
 * @param labels1 the first set of labels
 * @param labels2 the second set of labels
 * @returns true if and only if all of the values in `labels1` are equal to the values in `labels2` in the same order.
 */
export function labelsEqual(labels1: string[], labels2: string[]): boolean {
  return (
    labels1.length === labels2.length &&
    labels1.every((val, index) => val === labels2[index])
  );
}

/**
 * Gets the display version of a set of labels that is optimized for display to users.
 * @param labels labels to convert into display optimized form.
 * @returns the display optimized labels
 */
export function getDisplayLabels(labels: string[]): string[] {
  return labels.map((label, index) => {
    if (isEncodedLabelhash(label)) {
      return normalizeEncodedLabelhash(label);
    } else {
      if (label.length === 0) {
        if (labels.length === 1) {
          // a name with a single empty label is normalized
          return "";
        } else {
          // empty labels in a non-empty name are unnormalized
          // however we still want to display them as empty strings
          return "";
        }
      } else {
        try {
          return ens_beautify(label);
        } catch {
          // label is not ENS normalized. For safety we will display it as an encoded labelhash instead.
          return normalizeEncodedLabelhash(encodeLabelhash(labelhash(label)));
        }
      }
    }
  });
}

/**
 * Attempts to normalize a set of labels. If a label cannot be normalized, it will be unmodified.
 * @param labels labels to attempt to normalize
 * @returns the labels after an attempted normalization
 */
export function tryNormalize(labels: string[]): string[] {
  return labels.map((label) => {
    if (isEncodedLabelhash(label)) {
      return normalizeEncodedLabelhash(label);
    } else {
      try {
        return ens_normalize(label);
      } catch {
        return label;
      }
    }
  });
}

/**
 * Gets the `Normalization` status of a set of labels
 * @param labels labels to get the `Normalization` status of
 * @returns the `Normalization` status of the labels
 */
export function getNormalizationStatus(labels: string[]): Normalization {
  let foundUnnormalizedLabel = false;
  let foundUnknownLabel = false;

  labels.forEach((label, index) => {
    if (isEncodedLabelhash(label)) {
      foundUnknownLabel = true;
    } else {
      if (label.length === 0) {
        if (labels.length === 1) {
          // a name with a single empty label is normalized
        } else {
          // empty labels in a non-empty name are unnormalized
          foundUnnormalizedLabel = true;
        }
      } else {
        try {
          const normalizedLabel = ens_normalize(label);
          if (normalizedLabel !== label) {
            foundUnnormalizedLabel = true;
          }
        } catch {
          foundUnnormalizedLabel = true;
        }
      }
    }
  });

  if (foundUnnormalizedLabel) {
    // if any single label is unnormalized, the whole name is unnormalized
    return Normalization.Unnormalized;
  } else if (foundUnknownLabel) {
    // if any label was unknown, the whole name is unknown
    return Normalization.Unknown;
  } else {
    return Normalization.Normalized;
  }
}

/**
 * Builds an `ENSName` from a string.
 * @param name the name to build an `ENSName` from.
 * @returns an `ENSName` representing the name.
 */
export function buildENSName(name: string): ENSName {
  const labels = name.split(LABEL_SEPARATOR);
  const displayLabels = getDisplayLabels(labels);
  const displayName = displayLabels.join(LABEL_SEPARATOR);
  const normalization = getNormalizationStatus(labels);
  const node = namehash(name);

  return {
    name,
    labels,
    displayName,
    displayLabels,
    normalization,
    node,
  };
}

// TODO: define a proper whitelist of valid DNS Tlds (or perform dynamic DNS lookup)
const DNS_TLD_WHITELIST = ["com", "net", "org", "id", "io"];

/**
 * Identifies if a label represents a valid TLD in the DNS namespace.
 * @param label the TLD of a name
 * @returns true if the label is known to be valid in the DNS namespace. false if the label is
 *          known to be invalid in the DNS namespace. undefined if the status of the label is
 *          unknown in DNS.
 */
export function isValidDNSTld(label: string): boolean | undefined {
  if (label === ETH_TLD) {
    return false;
  } else if (label === "") {
    return true; // DNS root
  } else if (DNS_TLD_WHITELIST.indexOf(label) !== -1) {
    return true;
  } else {
    return undefined;
  }
}

/**
 * Identifies the namespace root of a name.
 * @param name the name to identify the namespace root of.
 * @returns `ens` if the namespace root is known to be ENS.
 *          `dns` if the namespace root is known to be DNS.
 *          `unknown` if the namespace root is unknown.
 */
export function getNamespaceRoot(name: ENSName): NamespaceRoot {
  if (name.labels.length === 0) {
    return "ens"; // we'll assume the ENS root for this case
  } else if (name.labels.length === 1 && name.labels[0].length === 0) {
    return "ens"; // we'll assume the ENS root for this case
  } else {
    const tld = name.labels[name.labels.length - 1];
    if (tld === ETH_TLD) {
      return "ens";
    } else if (isValidDNSTld(tld)) {
      return "dns";
    } else {
      return "unknown";
    }
  }
}

/**
 * Identifies the decentralization status of a name.
 * @param name the name to identify the decentralization status of.
 * @returns `unruggable` if ownership of the name is guaranteed to be decentralized and therefore unruggable.
 *          `icann` if ownership of the name falls under the jurisdiction of ICANN and therefore is not decentralized.
 *          `unknown` if the decentralization status of the name is unknown.
 */
export function getDecentralizationStatus(
  name: ENSName
): DecentralizationStatus {
  switch (getNamespaceRoot(name)) {
    case "ens":
      if (name.labels.length > 2) {
        // TODO: we need to add more logic here for checking details such as NameWrapper status, etc...
        return "unknown";
      } else {
        return "unruggable";
      }
    case "dns":
      return "icann";
    case "unknown":
      return "unknown";
  }
}

/**
 * Identifies the `RegistrationPotential` of an `ENSName`.
 * @param name the name to identify the `RegistrationPotential` of.
 * @returns the `RegistrationPotential` of the name.
 */
export function getRegistrationPotential(name: ENSName): RegistrationPotential {
  if (name.labels.length < 2) {
    // we're going to say namespace roots and any TLDs are unregisterable
    return "unregisterable";
  }

  switch (getNamespaceRoot(name)) {
    case "ens":
      if (
        charCount(name.labels[name.labels.length - 2]) <
        MIN_ETH_REGISTRABLE_LABEL_LENGTH
      ) {
        // too short to be allowed by any current ETHRegistrarControllers
        return "unregisterable";
      }

      switch (name.normalization) {
        case Normalization.Normalized:
          if (name.labels.length == 2) {
            // we can say with confidence these names could be registered
            return "registerable";
          } else {
            // TODO: we would need to check status of namewrapper fuses to see if the ability to issue subnames is burned
            return "unknown";
          }
        case Normalization.Unnormalized:
          return "invalid";
        case Normalization.Unknown:
          return "unknown";
      }
    case "dns":
      // TODO: enhance this logic in the future
      return "unknown";
    case "unknown":
      return "unknown";
  }
}

/**
 * Splits a string into its individual characters.
 * 
 * Splits the string into an array of its Unicode characters.
 * In Javascript, the ".split()" method of a string may give different result 
 * because it returns the array of UTF-16 code units.
 * Each element in the resulting array represents a single Unicode character.
 * 
 * @param text
 * @returns An array of the individual characters within `text`.
 */
export function splitCharacters(text: string): string[] {
  return [...text];
}

/**
 * Calculates the number of characters in a string.
 * 
 * NOTE: This length will be the same as determined by the EthRegistrarController smart contracts.
 * These contracts calculate length using the following code that counts Unicode characters in UTF-8 encoding.
 * https://github.com/ensdomains/ens-contracts/blob/staging/contracts/ethregistrar/StringUtils.sol
 * 
 * This length may be different than the traditional ".length" property of a string in JavaScript.
 * In Javascript, the ".length" property of a string returns the number of UTF-16 code units in that string.
 * UTF-16 represents Unicode characters with codepoints higher can fit within a 16 bit value as a "surrogate pair"
 * of UTF-16 code units. This means that some Unicode characters are represented by *more than one* UTF-16 code unit.
 * @param label
 * @returns the number of characters within `string`.
 */
export function charCount(text: string) {
  return splitCharacters(text).length;
}
