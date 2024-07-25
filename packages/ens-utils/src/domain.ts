import { Registration } from "./registration";
import { ENSName, MIN_ETH_REGISTRABLE_LABEL_LENGTH } from "./ensname";
import { Timestamp, addSeconds } from "./time";
import { NFTRef } from "./nft";
import { GRACE_PERIOD } from "./ethregistrar";
import { Address, buildAddress, isAddressEqual } from "./address";
import { hexToBigInt, keccak256, labelhash as labelHash, namehash } from "viem";
import { ens_beautify, ens_normalize } from "@adraffy/ens-normalize";

/**
 * Object containing properties necessary for domain name processing.
 * It is computed out of the user input, URL query parameter or database row data.
 */
export type DomainName = {
  /** Unique identifier of a domain */
  namehash: string;
  /** Domain slug to be used for URLs. It has a format of [labelhash].eth when the domain name is unknown or unnormalized */
  slug: string;
  /** Beautified domain name string, to be rendered in user interface */
  displayName: string;
  /** Normalized version of the name. Similar to `slug`, but it is null when the domain name is unknown or unnormalized */
  normalizedName: string | null;
  /** The label of the name. It can either be string like `vitalik` or `[0x123]` */
  labelName: string;
  /** keccak256 hash of the label */
  labelHash: string;
  unwrappedTokenId: bigint;
  wrappedTokenId: bigint;
};

export type DomainCard = {
  name: ENSName;

  /**
   * A reference to the NFT associated with `name`.
   *
   * null if and only if one or more of the following are true:
   * 1. name is not normalized
   * 2. name is not currently minted (name is on primary market, not secondary market) and the name is not currently expired in grace period
   * 3. we don't know a strategy to generate a NFTRef for the name on the specified chain (ex: name is associated with an unknown registrar)
   */
  nft: NFTRef | null;

  parsedName: DomainName;
  registration: Registration;
  /** Stringified JSON object with debug information about the name generator */
  nameGeneratorMetadata: string | null;
  /** Whether the domain is on watchlist */
  onWatchlist: boolean;
  ownerAddress: `0x${string}` | null;
  managerAddress: `0x${string}` | null;
  /** Former owner address is only set when the domain is in Grace Period */
  formerOwnerAddress: `0x${string}` | null;
  /** Former manager address is only set when the domain is in Grace Period */
  formerManagerAddress: `0x${string}` | null;
};

/**
 * Returns the expiration timestamp of a domain
 * @param registration Registration object from domain
 * @returns Timestamp | null
 */
export function domainExpirationTimestamp(
  registration: Registration,
): Timestamp | null {
  if (registration.expirationTimestamp) {
    return registration.expirationTimestamp;
  }
  return null;
}

/**
 * Returns the release timestamp of a domain, which is 90 days after expiration when the Grace Period ends
 * @param registration Registration object from domain
 * @returns Timestamp | null
 */
export function domainReleaseTimestamp(
  registration: Registration,
): Timestamp | null {
  const expirationTimestamp = domainExpirationTimestamp(registration);
  if (expirationTimestamp === null) return null;

  const releaseTimestamp = addSeconds(expirationTimestamp, GRACE_PERIOD);
  return releaseTimestamp;
}

/* 
  Below enum options differ based on domain's owner
  and on its secondary marketplace status:
  If domain has no owner: noOwner;
  If domain has an owner but user is not the owner: notOwner;
  If user is owner of the domain and domain is in Grace Period: formerOwner;
  If user is owner of the domain and domain is not in Grace Period: activeOwner;
*/
export enum UserOwnershipOfDomain {
  noOwner = "noOwner",
  notOwner = "notOwner",
  formerOwner = "formerOwner",
  activeOwner = "activeOwner",
}

/**
 * Returns the ownership status of a domain in comparison to a given address
 * @param domainCard DomainCard object
 * @param addressToCompareOwnership The address to compare ownership represents the address
 * of the user who is viewing the domain, or the address of the application wants to check
 * the ownership when getting to know the ownership of a domain.
 * @returns UserOwnershipOfDomain
 */
export const getUserOwnership = (
  domainCard: DomainCard,
  addressToCompareOwnership: Address | null,
): UserOwnershipOfDomain => {
  if (!domainCard.ownerAddress && !domainCard.formerOwnerAddress)
    return UserOwnershipOfDomain.noOwner;

  if (addressToCompareOwnership) {
    const isFormerOwner =
      domainCard.formerOwnerAddress &&
      isAddressEqual(
        buildAddress(domainCard.formerOwnerAddress),
        addressToCompareOwnership,
      );

    if (isFormerOwner) {
      return UserOwnershipOfDomain.formerOwner;
    }

    const isOwner =
      domainCard.ownerAddress &&
      isAddressEqual(
        addressToCompareOwnership,
        buildAddress(domainCard.ownerAddress),
      );

    if (isOwner) {
      return UserOwnershipOfDomain.activeOwner;
    }
  }

  return UserOwnershipOfDomain.notOwner;
};

export enum ParseNameErrorCode {
  Empty = "Empty",
  TooShort = "TooShort",
  UnsupportedTLD = "UnsupportedTLD",
  UnsupportedSubdomain = "UnsupportedSubdomain",
  MalformedName = "MalformedName",
  MalformedLabelHash = "MalformedLabelHash",
}

type ParseNameErrorDetails = {
  normalizedName: string | null;
  displayName: string | null;
};
export class ParseNameError extends Error {
  public readonly errorCode: ParseNameErrorCode;
  public readonly errorDetails: ParseNameErrorDetails | null;

  constructor(
    message: string,
    errorCode: ParseNameErrorCode,
    errorDetails: ParseNameErrorDetails | null,
  ) {
    super(message);

    this.errorCode = errorCode;
    this.errorDetails = errorDetails;
  }
}

export const DEFAULT_TLD = "eth";

export const DefaultParseNameError = new ParseNameError(
  "Empty name",
  ParseNameErrorCode.Empty,
  null,
);

export const hasMissingNameFormat = (label: string) =>
  new RegExp("\\[([0123456789abcdef]*)\\]").test(label) && label.length === 66;

const labelhash = (label: string) => labelHash(label);

const getPrefixes = (input: string): string[] => {
  const prefixes: string[] = [];

  for (let i = 1; i <= input.length; i++) {
    prefixes.push(input.slice(0, i));
  }

  return prefixes;
};

const keccak = (input: Buffer | string) => {
  let out = null;
  if (Buffer.isBuffer(input)) {
    out = keccak256(input);
  } else {
    out = labelhash(input);
  }
  return out.slice(2); // cut 0x
};

const initialNode =
  "0000000000000000000000000000000000000000000000000000000000000000";

export const namehashFromMissingName = (inputName: string): string => {
  let node = initialNode;

  const split = inputName.split(".");
  const labels = [split[0].slice(1, -1), keccak(split[1])];

  for (let i = labels.length - 1; i >= 0; i--) {
    const labelSha = labels[i];
    node = keccak(Buffer.from(node + labelSha, "hex"));
  }
  return "0x" + node;
};

/**
 * Parse and heal input string to a DomainName.
 * @param input User input or slug.
 * @return Object containing properties necessary for DomainName for any supported name.
 * @throws {ParseNameError}, when input is unsupported or cannot be healed.
 */
export const getDomainName = (input = ""): DomainName => {
  const cleanedInput = input.replace(/ /g, "");

  if (cleanedInput.length === 0) {
    throw new ParseNameError("Empty name", ParseNameErrorCode.Empty, null);
  }

  const inputLabels = cleanedInput.split(".");

  let curatedLabels: string[] = [];

  if (inputLabels.length < 2) {
    curatedLabels = [...inputLabels, DEFAULT_TLD];
  } else {
    curatedLabels = inputLabels;
  }

  // auto-fill top level domain
  if (
    getPrefixes(DEFAULT_TLD).some(
      (prefix) => curatedLabels[curatedLabels.length - 1] === prefix,
    ) ||
    curatedLabels[curatedLabels.length - 1] === ""
  ) {
    curatedLabels = [...curatedLabels.slice(0, -1), DEFAULT_TLD];
  }

  if (curatedLabels[curatedLabels.length - 1] !== DEFAULT_TLD) {
    throw new ParseNameError(
      "Unsupported top level name",
      ParseNameErrorCode.UnsupportedTLD,
      null,
    );
  }

  if (curatedLabels.length > 2) {
    throw new ParseNameError(
      "Unsupported subdomain",
      ParseNameErrorCode.UnsupportedSubdomain,
      null,
    );
  }

  const firstCuratedLabel = curatedLabels[0].toLowerCase();

  // handle undiscovered name format, like [0x00...].eth
  if (firstCuratedLabel.startsWith("[") && firstCuratedLabel.endsWith("]")) {
    if (hasMissingNameFormat(firstCuratedLabel)) {
      const searchedName = curatedLabels.join(".").toLowerCase();
      const namehash = namehashFromMissingName(searchedName);
      const labelHash = "0x" + firstCuratedLabel.slice(1, -1);

      return {
        namehash,
        slug: searchedName,
        displayName: searchedName,
        normalizedName: null,
        labelName: firstCuratedLabel,
        labelHash,

        // Below values are guaranteed to be 0x strings
        unwrappedTokenId: hexToBigInt(labelHash as `0x${string}`),
        wrappedTokenId: hexToBigInt(namehash as `0x${string}`),
      };
    } else {
      throw new ParseNameError(
        "Invalid labelhash",
        ParseNameErrorCode.MalformedLabelHash,
        null,
      );
    }
  } else {
    const searchedName = curatedLabels.join(".");

    let normalizedName = null;
    try {
      normalizedName = ens_normalize(searchedName);
    } catch (e) {
      throw new ParseNameError(
        "Invalid ENS name",
        ParseNameErrorCode.MalformedName,
        null,
      );
    }

    const normalizedLabel = normalizedName.split(".")[0];
    if (normalizedLabel.length < MIN_ETH_REGISTRABLE_LABEL_LENGTH) {
      throw new ParseNameError(
        "Name is too short",
        ParseNameErrorCode.TooShort,
        {
          normalizedName,
          displayName: ens_beautify(normalizedName),
        },
      );
    }

    const nh = namehash(normalizedName);
    const labelHash = labelhash(normalizedLabel);
    const displayName = ens_beautify(normalizedName);

    return {
      namehash: nh,
      slug: normalizedName,
      displayName,
      normalizedName,
      labelName: normalizedLabel,
      labelHash,

      // Below values are guaranteed to be 0x strings
      unwrappedTokenId: hexToBigInt(labelHash as `0x${string}`),
      wrappedTokenId: hexToBigInt(nh as `0x${string}`),
    };
  }
};
