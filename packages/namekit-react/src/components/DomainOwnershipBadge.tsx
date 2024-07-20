import { useEffect, useState } from "react";
import {
  Address,
  DomainCard,
  getUserOwnership,
  UserOwnershipOfDomain,
} from "@namehash/ens-utils";
import React from "react";
import cc from "classcat";

interface DomainOwnershipBadgeProps {
  domain: DomainCard | null; // when null we show the skeleton
  onClickHandler?: () => void;
  addressToCompareOwnership: Address | null;
}

export const DomainOwnershipBadge = ({
  domain,
  onClickHandler,
  addressToCompareOwnership,
}: DomainOwnershipBadgeProps) => {
  const [userOwnershipOfDomain, setUserOwnershipOfDomain] =
    useState<UserOwnershipOfDomain | null>(null);

  useEffect(() => {
    if (domain === null) {
      setUserOwnershipOfDomain(null);
      return;
    }

    const userOwnership = getUserOwnership(domain, addressToCompareOwnership);

    setUserOwnershipOfDomain(userOwnership);
  }, [domain]);

  const baseStyle = `nk-rounded-full nk-text-xs nk-font-bold nk-px-3 nk-py-1 nk-font-medium nk-text-center ${onClickHandler ? "nk-cursor-pointer" : "nk-cursor-auto"}`;

  if (userOwnershipOfDomain === UserOwnershipOfDomain.formerOwner) {
    return (
      <div
        onClick={onClickHandler}
        role={onClickHandler ? "button" : "contentinfo"}
        className={cc([baseStyle, "nk-bg-red-100 nk-text-red-600"])}
      >
        Ownership expired
      </div>
    );
  } else if (userOwnershipOfDomain === UserOwnershipOfDomain.activeOwner) {
    return (
      <div
        onClick={onClickHandler}
        role={onClickHandler ? "button" : "contentinfo"}
        className={cc([baseStyle, "nk-bg-green-100 nk-text-green-600"])}
      >
        Owned
      </div>
    );
  }

  // in case the domain is notOwned or has noOwner, don't show any badge
  return <></>;
};
