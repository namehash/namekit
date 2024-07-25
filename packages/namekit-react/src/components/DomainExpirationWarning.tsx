import {
  AvailableNameTimelessPriceUSD,
  formatTimestampAsDistanceToNow,
  SecondaryRegistrationStatus,
  PrimaryRegistrationStatus,
  domainExpirationTimestamp,
  domainReleaseTimestamp,
  UserOwnershipOfDomain,
  getUserOwnership,
  formatTimestamp,
  formattedPrice,
  Registration,
  ENSName,
  Address,
} from "@namehash/ens-utils";
import { ClockIcon, ClockUrgency } from "./icons/ClockIcon";
import React, { useEffect, useState } from "react";
import { Tooltip } from "./Tooltip";
import cc from "classcat";

interface DomainExpirationWarningProps {
  domainName: ENSName | null; // when null we show the skeleton
  domainRegistration: Registration | null;
  /* 
    If domain is in Grace Period, the address that used to own 
    the domain is considered as the former owner of the domain

    More reference documentation can be found in:
    https://support.ens.domains/en/articles/8046877-name-lifecycle
  */
  formerDomainOwnerAddress: Address | null;
  /* 
    If domain is Registered or Expired, there is one
    address that is considered the owner of the domain

    More reference documentation can be found in:
    https://support.ens.domains/en/articles/8046877-name-lifecycle
  */
  currentDomainOwnerAddress: Address | null;
  /* 
    Below address is the one used in domain's ownership
    determination, where depending on the match between
    the "addressToCompareOwnership", "currentDomainOwnerAddress"
    and the "formerDomainOwnerAddress", different Ui elements
    are displayed alongside with text information about
    the specific domain's ownership status.
  */
  addressToCompareOwnership: Address | null;
  onIconClickHandler?: () => void;
  onlyIcon?: boolean;
}

export const DomainExpirationWarning = ({
  formerDomainOwnerAddress,
  addressToCompareOwnership,
  currentDomainOwnerAddress,
  domainRegistration,
  domainName,
  onIconClickHandler,
  onlyIcon = true,
}: DomainExpirationWarningProps) => {
  const [userOwnershipOfDomain, setUserOwnershipOfDomain] =
    useState<UserOwnershipOfDomain | null>(null);

  useEffect(() => {
    if (
      addressToCompareOwnership === null ||
      (!addressToCompareOwnership && !formerDomainOwnerAddress)
    ) {
      setUserOwnershipOfDomain(null);
      return;
    }

    const userOwnership = getUserOwnership(
      formerDomainOwnerAddress,
      currentDomainOwnerAddress,
      addressToCompareOwnership,
    );

    setUserOwnershipOfDomain(userOwnership);
  }, [
    formerDomainOwnerAddress,
    currentDomainOwnerAddress,
    addressToCompareOwnership,
  ]);

  if (domainName === null || domainRegistration === null) return <></>;

  const icon = !onIconClickHandler ? (
    <ClockIcon
      withPointerCursor={false}
      clockUrgency={
        userOwnershipOfDomain === UserOwnershipOfDomain.formerOwner
          ? ClockUrgency.High
          : ClockUrgency.Low
      }
    />
  ) : (
    <button onClick={() => onIconClickHandler()}>
      <ClockIcon
        withPointerCursor={true}
        clockUrgency={
          userOwnershipOfDomain === UserOwnershipOfDomain.formerOwner
            ? ClockUrgency.High
            : ClockUrgency.Low
        }
      />
    </button>
  );

  if (
    domainRegistration.primaryStatus === PrimaryRegistrationStatus.Active &&
    domainRegistration.secondaryStatus ===
      SecondaryRegistrationStatus.ExpiringSoon
  ) {
    const expirationDate = domainExpirationTimestamp(domainRegistration);
    if (expirationDate === null) return <></>;

    const namePrice = AvailableNameTimelessPriceUSD(domainName);
    const prettyNamePrice = namePrice
      ? formattedPrice({
          price: namePrice,
          withPrefix: false,
        })
      : "";

    if (onlyIcon)
      return (
        <div onClick={(e) => e.preventDefault()}>
          <Tooltip trigger={icon}>
            <div className="nk-flex nk-text-sm nk-space-x-1">
              <p>Domain expires </p>
              <Tooltip
                trigger={
                  <p>{formatTimestampAsDistanceToNow(expirationDate)}</p>
                }
              >
                <p>{formatTimestamp(expirationDate)}</p>
              </Tooltip>
              <p>
                {domainName.normalization === "normalized"
                  ? `and renews for ${prettyNamePrice} / year`
                  : ""}
              </p>
            </div>
          </Tooltip>
        </div>
      );
    else
      return (
        <div
          className="nk-flex nk-items-center nk-flex-row nk-mb-4"
          onClick={(e) => e.preventDefault()}
        >
          <div className="nk-w-5 nk-h-5">{icon}</div>
          <div
            className={cc([
              "nk-flex nk-text-sm nk-ml-3 nk-space-x-1",
              {
                "nk-text-red-500":
                  userOwnershipOfDomain === UserOwnershipOfDomain.activeOwner,
                "nk-text-gray-400":
                  userOwnershipOfDomain !== UserOwnershipOfDomain.activeOwner,
              },
            ])}
          >
            <p>Domain expires </p>
            <Tooltip
              trigger={<p>{formatTimestampAsDistanceToNow(expirationDate)}</p>}
            >
              <p>{formatTimestamp(expirationDate)}</p>
            </Tooltip>
            <p>
              {domainName.normalization === "normalized"
                ? `and renews for ${prettyNamePrice} / year`
                : ""}
            </p>
          </div>
        </div>
      );
  }

  if (
    domainRegistration.primaryStatus === PrimaryRegistrationStatus.Expired &&
    domainRegistration.secondaryStatus ===
      SecondaryRegistrationStatus.GracePeriod
  ) {
    const releaseDate = domainReleaseTimestamp(domainRegistration);

    if (releaseDate === null) return <></>;

    const text =
      userOwnershipOfDomain === UserOwnershipOfDomain.formerOwner
        ? `Expired in grace period. Renew before release`
        : `Expired in grace period. Releases to the public`;

    if (onlyIcon)
      return (
        <div onClick={(e) => e.preventDefault()}>
          <Tooltip trigger={icon}>
            <div className="nk-flex nk-text-sm nk-space-x-1">
              <p>{text}</p>
              <Tooltip
                trigger={<p>{formatTimestampAsDistanceToNow(releaseDate)}</p>}
              >
                <p>{formatTimestamp(releaseDate)}</p>
              </Tooltip>
            </div>
          </Tooltip>
        </div>
      );
    else
      return (
        <div
          className="nk-flex nk-items-center nk-flex-row nk-mb-4"
          onClick={(e) => e.preventDefault()}
        >
          <div className="nk-w-5 nk-h-5">{icon}</div>
          <div
            className={cc([
              "nk-flex nk-text-sm nk-ml-3 nk-space-x-1",
              {
                "nk-text-red-500":
                  userOwnershipOfDomain === UserOwnershipOfDomain.formerOwner,
                "nk-text-gray-400":
                  userOwnershipOfDomain !== UserOwnershipOfDomain.formerOwner,
              },
            ])}
          >
            <p>{text}</p>
            <Tooltip
              trigger={<p>{formatTimestampAsDistanceToNow(releaseDate)}</p>}
            >
              <p>{formatTimestamp(releaseDate)}</p>
            </Tooltip>
          </div>
        </div>
      );
  }

  // in case the name / domain is in any other state, don't show any expiration warning
  return <></>;
};
