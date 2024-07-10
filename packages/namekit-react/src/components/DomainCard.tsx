import React, { useRef, useState } from "react";
import { DisplayedName } from "./DisplayedName";
import { Address, type DomainCard } from "@namehash/ens-utils";
import { DomainMenu } from "./DomainMenu";
import { EnsAvatar } from "./EnsAvatar";
import cc from "classcat";
import { ExpirationWarning } from "./ExpirationWarning";
import { OwnershipBadge } from "./OwnershipBadge";
import { Normalization } from "@namehash/nameguard";

export type DomainCardProps = {
  domainCard: DomainCard | null; // if no domain card we show a loading state component skeleton
  withDomainMenu?: boolean;
  withHoverEffect?: boolean;
  visitorAddress: Address | null;
  extraHoverArea?: boolean; // if true, we show a hover effect outside the card in the x axis
  extraHoverAreaWidth?: number; // the width of a wanted extra hover area
  nameCardClickHandler?: (e: React.MouseEvent) => void;
  compactNamecardThreshold?: number; // if the width of the card is less than this value, we show the compact namecard component variation
};

const EXTRA_HOVER_AREA_WIDTH = 600;

export function DomainCard({
  domainCard,
  visitorAddress,
  withDomainMenu = true,
  extraHoverArea = true,
  withHoverEffect = true,
  nameCardClickHandler = undefined,
  extraHoverAreaWidth = EXTRA_HOVER_AREA_WIDTH,
}: DomainCardProps) {
  const domainRef = useRef<HTMLDivElement>(null);
  const [nameCardHovered, setNameCardHovered] = useState(false);
  const [shouldTakeActionOnClick, setShouldTakeActionOnClick] = useState(true);

  const withActionOnClickClass = nameCardClickHandler
    ? "nk-cursor-pointer"
    : "nk-cursor-auto";

  if (!domainCard) {
    return (
      <div role="button" className={withActionOnClickClass}>
        <div className={cc(["nk-relative", withActionOnClickClass])}>
          <div className="nk-w-full nk-relative nk--my-px nk-flex nk-items-center nk-justify-between nk-transition-all nk-duration-200 nk-py-2.5">
            <div className="nk-w-full nk-flex nk-justify-between nk-items-center nk-pt-1">
              <div className="nk-flex nk-space-x-2.5 nk-items-center nk-flex-wrap">
                <EnsAvatar name={null} />
                <DisplayedName
                  textStylingClasses="nk-text-lg nk-font-semibold nk-line-clamp-2"
                  name={null}
                />
              </div>
              <div className="nk-w-20 nk-h-3 nk-rounded-lg nk-animate-pulse nk-bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const onCardClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!shouldTakeActionOnClick || !domainCard) {
      e.preventDefault();
      setShouldTakeActionOnClick(true);
    } else if (nameCardClickHandler) {
      nameCardClickHandler(e);
    }
  };

  return (
    <div
      role="button"
      onClick={(e) => onCardClick(e)}
      className={withActionOnClickClass}
    >
      <div
        className={cc(["nk-relative", withActionOnClickClass])}
        ref={domainRef}
      >
        <div
          className={cc([
            "nk-absolute",
            nameCardHovered && withHoverEffect && "nk-bg-gray-50 nk-rounded-md",
            !extraHoverArea && "!nk-rounded-none",
            withActionOnClickClass,
          ])}
          style={{
            width: domainRef.current?.offsetWidth
              ? domainRef.current?.offsetWidth +
                (extraHoverArea ? extraHoverAreaWidth : 0)
              : 0,
            height: domainRef.current?.offsetHeight
              ? domainRef.current?.offsetHeight
              : 0,
            transform:
              `nk-translateX(${extraHoverArea ? -extraHoverAreaWidth / 2 : 0}px)` +
              " nk-translateY(-1px)",
          }}
          onMouseEnter={() => setNameCardHovered(true)}
          onMouseLeave={() => setNameCardHovered(false)}
          onTouchStart={() => setNameCardHovered(true)}
          onTouchEnd={() => setNameCardHovered(false)}
        ></div>

        <div
          className="nk-w-full nk-relative nk--my-px nk-flex nk-items-center nk-justify-between nk-transition-all nk-duration-200 nk-py-2.5"
          onMouseEnter={() => setNameCardHovered(true)}
          onMouseLeave={() => setNameCardHovered(false)}
          onTouchStart={() => setNameCardHovered(true)}
          onTouchEnd={() => setNameCardHovered(false)}
        >
          <div className="nk-w-full nk-flex nk-justify-between nk-items-center">
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                nameCardClickHandler?.(e);
              }}
              className="nk-flex nk-space-x-2.5 nk-items-center"
            >
              <div className="nk-hidden mobile:nk-block">
                <EnsAvatar name={domainCard.name} />
              </div>
              <div className="nk-flex nk-items-start nk-justify-center nk-flex-wrap nk-w-max nk-flex-col mobile:nk-flex-row mobile:nk-justify-start mobile:nk-items-center">
                <div className="nk-flex nk-items-center">
                  <div className="nk-mr-2.5 nk-my-1">
                    <DisplayedName
                      textStylingClasses={cc([
                        "nk-text-lg nk-font-semibold nk-line-clamp-2",
                        {
                          "nk-text-red-700":
                            domainCard.name.normalization !==
                            Normalization.normalized,
                        },
                      ])}
                      name={domainCard.name}
                    />
                  </div>
                  <div className="nk-my-1 mr-3 nk-mr-2.5">
                    <ExpirationWarning
                      domain={domainCard}
                      viewerAddress={visitorAddress}
                    />
                  </div>
                </div>
                <div className="w-fit nk-mr-2.5 nk-my-1">
                  <OwnershipBadge
                    domain={domainCard}
                    addressToCompareOwnership={visitorAddress}
                  />
                </div>
              </div>
            </div>
            <div className="nk-flex nk-items-center nk-justify-end nk-h-12 lg:nk-h-[56px] nk-space-x-2.5">
              <div className="nk-flex nk-justify-self-end nk-space-x-2.5 nk-items-center"></div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShouldTakeActionOnClick(false);
                }}
              >
                {withDomainMenu && <DomainMenu domainCard={domainCard} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
