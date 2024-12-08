import { useAuthenticatedUser } from "./useAuthenticatedUser";
import { type DomainCard, UserOwnershipOfDomain } from "../lib/shared/types";
import { useEffect, useState } from "react";
import { isAddressEqual } from "viem";

interface DomainOwnershipHookProps {
  domainCard: DomainCard | null;
}

export const useDomainOwnership = ({
  domainCard,
}: DomainOwnershipHookProps): {
  userOwnershipOfDomain: UserOwnershipOfDomain;
} => {
  const { authenticatedUserAddress } = useAuthenticatedUser();
  const [userOwnershipOfDomain, setUserOwnership] =
    useState<UserOwnershipOfDomain>(UserOwnershipOfDomain.noOwner);

  useEffect(() => {
    if (domainCard === null) return;

    const userOwnershipOfDomain = getUserOwnership(
      domainCard,
      authenticatedUserAddress,
    );

    setUserOwnership(userOwnershipOfDomain);
  }, [authenticatedUserAddress, domainCard]);

  return {
    userOwnershipOfDomain,
  };
};

const getUserOwnership = (
  domainCard: DomainCard,
  authenticatedAddress: `0x${string}` | null,
): UserOwnershipOfDomain => {
  if (!domainCard.ownerAddress && !domainCard.formerOwnerAddress)
    return UserOwnershipOfDomain.noOwner;

  if (authenticatedAddress) {
    const isFormerOwner =
      domainCard.formerOwnerAddress &&
      isAddressEqual(domainCard.formerOwnerAddress, authenticatedAddress);

    if (isFormerOwner) {
      return UserOwnershipOfDomain.formerOwner;
    }

    const isOwner =
      domainCard.ownerAddress &&
      isAddressEqual(authenticatedAddress, domainCard.ownerAddress);

    if (isOwner) {
      return UserOwnershipOfDomain.activeOwner;
    }
  }

  return UserOwnershipOfDomain.notOwner;
};
