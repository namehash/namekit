import { Registration } from "./registration";
import { Timestamp, addSeconds } from "./time";
import { GRACE_PERIOD } from "./ethregistrar";
import { Address, isAddressEqual } from "./address";
import { keccak256, labelhash as labelHash } from "viem";

/**
 * Returns the expiration timestamp of a domain
 * @param domainRegistration Registration object from domain
 * @returns Timestamp | null
 */
export function domainExpirationTimestamp(
  domainRegistration: Registration,
): Timestamp | null {
  if (domainRegistration.expirationTimestamp) {
    return domainRegistration.expirationTimestamp;
  }
  return null;
}

/**
 * Returns the release timestamp of a domain, which is 90 days after expiration when the Grace Period ends
 * @param domainRegistration Registration object from domain
 * @returns Timestamp | null
 */
export function domainReleaseTimestamp(
  domainRegistration: Registration,
): Timestamp | null {
  const expirationTimestamp = domainExpirationTimestamp(domainRegistration);
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
 * @param formerDomainOwnerAddress Address of former domain owner (last owner before Grace Period)
 * @param currentDomainOwnerAddress Address of current domain owner
 * @param addressToCompareOwnership The address to compare ownership represents the address
 * of the user who is viewing the domain, or the address of the application wants to check
 * the ownership when getting to know the ownership of a domain.
 * @returns UserOwnershipOfDomain
 */
export const getUserOwnership = (
  formerDomainOwnerAddress: Address | null,
  currentDomainOwnerAddress: Address | null,
  addressToCompareOwnership: Address | null,
): UserOwnershipOfDomain => {
  if (!currentDomainOwnerAddress && !formerDomainOwnerAddress)
    return UserOwnershipOfDomain.noOwner;

  if (addressToCompareOwnership) {
    const isFormerOwner =
      formerDomainOwnerAddress &&
      isAddressEqual(formerDomainOwnerAddress, addressToCompareOwnership);

    if (isFormerOwner) {
      return UserOwnershipOfDomain.formerOwner;
    }

    const isOwner =
      currentDomainOwnerAddress &&
      isAddressEqual(addressToCompareOwnership, currentDomainOwnerAddress);

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
