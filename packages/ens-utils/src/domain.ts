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

/*
 * Defines the ownership relation between a domain and a user.
 */
export const UserOwnershipOfDomain = {
  /*
   * The domain has no `ActiveOwner` or `FormerOwner`.
   */
  NoOwner: "NoOwner",

  /*
   * The domain has an `ActiveOwner` or a `FormerOwner` but they are not the
   * user.
   */
  NotOwner: "NotOwner",

  /*
   * The user was previously the `ActiveOwner` of the domain, however the
   * registration of the domain is now in grace period.
   */
  FormerOwner: "FormerOwner",

  /* 
   * The user is the owner of the domain that has an active registration (not
   * in grace period).
   */
  ActiveOwner: "ActiveOwner",
};

export type UserOwnershipOfDomain =
  (typeof UserOwnershipOfDomain)[keyof typeof UserOwnershipOfDomain];

/**
 * Returns the `UserOwnershipOfDomain` relation between a `DomainCard` and the
 * `Address` of the current user.
 * 
 * @param domain The `DomainCard` to check the `UserOwnershipOfDomain`
 *               relationship with.
 * @param currentUserAddress `Address` of the current user, or `null` if there
 *                           is no current user signed in.
 * @returns The appropriate `UserOwnershipOfDomain` value given the provided
 *          `domain` and `currentUserAddress`.
 */
export const getCurrentUserOwnership = (
  domain: DomainCard,
  currentUserAddress: Address | null,
): UserOwnershipOfDomain => {

  if (!domain.ownerAddress && !domain.formerOwnerAddress) {
    return UserOwnershipOfDomain.NoOwner;
  }

  if (currentUserAddress) {

    if (domain.ownerAddress &&
        isAddressEqual(domain.ownerAddress, currentUserAddress)) {
      return UserOwnershipOfDomain.ActiveOwner;
    }

    if (domain.formerOwnerAddress &&
        isAddressEqual(domain.formerOwnerAddress, currentUserAddress)) {
      return UserOwnershipOfDomain.FormerOwner;
    }
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
