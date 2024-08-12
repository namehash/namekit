import { NFTRef } from "./nft";
import { ENSName } from "./ensname";
import { Address, isAddressEqual } from "./address";
import { keccak256, labelhash as labelHash } from "viem";
import { Registration } from "./ethregistrar";

export interface DomainCard {
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
  registration: Registration;
  ownerAddress: Address | null;
  managerAddress: Address | null;
  /** Former owner address is only set when the domain is in Grace Period */
  formerOwnerAddress: Address | null;
  /** Former manager address is only set when the domain is in Grace Period */
  formerManagerAddress: Address | null;
}

/* Defines the ownership of a domain for a given address */
export const UserOwnershipOfDomain = {
  /* NoOwner: If domain has no owner */
  NoOwner: "NoOwner",

  /* NotOwner: If domain has an owner but user is not the owner */
  NotOwner: "NotOwner",

  /* FormerOwner: If user is owner of the domain and domain is in Grace Period */
  FormerOwner: "FormerOwner",

  /* ActiveOwner: If user is owner of the domain and domain is not in Grace Period */
  ActiveOwner: "ActiveOwner",
};
export type UserOwnershipOfDomain =
  (typeof UserOwnershipOfDomain)[keyof typeof UserOwnershipOfDomain];

/**
 * Returns the ownership status of a domain in comparison to the current user's address
 * @param domain Domain that is being checked. If null, returns UserOwnershipOfDomain.NoOwner
 * @param currentUserAddress Address of the current user.
 *                           If null, returns UserOwnershipOfDomain.NoOwner or UserOwnershipOfDomain.NotOwner
 * @returns UserOwnershipOfDomain
 */
export const getCurrentUserOwnership = (
  domain: DomainCard | null,
  currentUserAddress: Address | null,
): UserOwnershipOfDomain => {
  const formerDomainOwnerAddress =
    domain && domain.formerOwnerAddress ? domain.formerOwnerAddress : null;
  const ownerAddress =
    domain && domain.ownerAddress ? domain.ownerAddress : null;

  if (currentUserAddress && formerDomainOwnerAddress) {
    const isFormerOwner =
      formerDomainOwnerAddress &&
      isAddressEqual(formerDomainOwnerAddress, currentUserAddress);

    if (isFormerOwner) {
      return UserOwnershipOfDomain.FormerOwner;
    }

    const isOwner =
      ownerAddress && isAddressEqual(currentUserAddress, ownerAddress);

    if (isOwner) {
      return UserOwnershipOfDomain.ActiveOwner;
    }
  }

  if (!ownerAddress) {
    return UserOwnershipOfDomain.NoOwner;
  }

  return UserOwnershipOfDomain.NotOwner;
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
