import {
  Address,
  AvailableNameTimelessPriceUSD,
  DomainCard,
  formattedPrice,
  formatTimestampAsDistanceToNow,
  PrimaryRegistrationStatus,
  domainExpirationTimestamp,
  SecondaryRegistrationStatus,
  formatTimestamp,
} from "@namehash/ens-utils";
import React, { useEffect, useState } from "react";
import cc from "classcat";
import { Normalization } from "@namehash/nameguard";
import { Tooltip } from "./Tooltip";
import { domainReleaseTimestamp } from "@namehash/ens-utils";
import { ClockIcon, ClockUrgency } from "./icons/ClockIcon";
import { UserOwnershipOfDomain } from "@namehash/ens-utils";
import { getUserOwnership } from "@namehash/ens-utils";

interface ExpirationWarningProps {
  onlyIcon?: boolean;
  /* 
    Below address is used to display different text
    messages based on the ownership of the domain
  */
  viewerAddress: Address | null;
  onIconClickHandler?: () => void;
  domain: DomainCard | null; // when null we show the skeleton
}

export const ExpirationWarning = ({
  domain,
  onlyIcon = true,
  onIconClickHandler,
  viewerAddress = null,
}: ExpirationWarningProps) => {
  const [userOwnershipOfDomain, setUserOwnershipOfDomain] =
    useState<UserOwnershipOfDomain | null>(null);

  useEffect(() => {
    if (domain === null) {
      setUserOwnershipOfDomain(null);
      return;
    }

    const userOwnership = getUserOwnership(domain, viewerAddress);

    setUserOwnershipOfDomain(userOwnership);
  }, [domain]);

  if (domain === null) return <></>;

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
    domain.registration.primaryStatus === PrimaryRegistrationStatus.Active &&
    domain.registration.secondaryStatus ===
      SecondaryRegistrationStatus.ExpiringSoon
  ) {
    const expirationDate = domainExpirationTimestamp(domain.registration);
    if (expirationDate === null) return <></>;

    const namePrice = AvailableNameTimelessPriceUSD(domain.parsedName);
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
                {domain.name.normalization === Normalization.normalized
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
              {domain.name.normalization === Normalization.normalized
                ? `and renews for ${prettyNamePrice} / year`
                : ""}
            </p>
          </div>
        </div>
      );
  }

  if (
    domain.registration.primaryStatus === PrimaryRegistrationStatus.Expired &&
    domain.registration.secondaryStatus ===
      SecondaryRegistrationStatus.GracePeriod
  ) {
    const releaseDate = domainReleaseTimestamp(domain.registration);

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
