import { Registration } from "./registration";
import { ENSName } from "./ensname";
import { Timestamp, addSeconds } from "./time";
import { NFTRef } from "./nft";
import { GRACE_PERIOD } from "./ethregistrar";
import { Address, buildAddress, isAddressEqual } from "./address";

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
 * @param addressToCompareOwnership Address to compare ownership
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
