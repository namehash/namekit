import { NFTRef } from "./nft";
import { ENSName } from "./ensname";
import { Address, isAddressEqual } from "./address";
import { Registration } from "./registrar";

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
    if (
      domain.ownerAddress &&
      isAddressEqual(domain.ownerAddress, currentUserAddress)
    ) {
      return UserOwnershipOfDomain.ActiveOwner;
    }

    if (
      domain.formerOwnerAddress &&
      isAddressEqual(domain.formerOwnerAddress, currentUserAddress)
    ) {
      return UserOwnershipOfDomain.FormerOwner;
    }
  }

  return UserOwnershipOfDomain.NotOwner;
};
