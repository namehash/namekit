"use client";
import {
  Normalization,
  type ConsolidatedNameGuardReport,
} from "@namehash/nameguard";
import React, { useEffect, useState, useRef } from "react";
import cc from "classcat";

import { ReportIcon } from "../ReportIcon/index";
import { RatingLoadingIcon, RatingIconSize, Tooltip } from "../..";
import { UnknownReportIcon } from "../UnknownReportIcon/UnknownReportIcon";
import { ENSName } from "@namehash/ens-utils";

interface ReportBadgeProps {
  /*
    The data prop is the consolidated report for the ensName.
    The ensName prop is the ENSName object.

    The data prop should always be relative to the ensName prop.
    This means that the data prop should always be the report for
    the ensName provided in the ensName prop.
  */
  ensName: ENSName;
  data?: ConsolidatedNameGuardReport;

  hadLoadingError?: boolean;
  displayUnnormalizedNames?: boolean;
  onClickOverride?: (ensName: ENSName) => void;

  /*
    Below number is a measure of the maximum width that the ensName 
    should have inside ReportBadge. If the ensName displayed is longer 
    than this number, the badge will truncate the ensName and display a 
    tooltip on hover that shows the full ensName. This number is measured in pixels.
  */
  maxEnsNameDisplayWidth?: number;
}

const DEFAULT_MAX_ENSNAME_DISPLAY_WIDTH = 200;

export function ReportBadge({
  data,
  ensName,
  onClickOverride,
  hadLoadingError = false,
  displayUnnormalizedNames = false,
  maxEnsNameDisplayWidth = DEFAULT_MAX_ENSNAME_DISPLAY_WIDTH,
}: ReportBadgeProps) {
  const buttonClass =
    "flex-shrink-0 appearance-none bg-white transition-colors hover:bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1.5 inline-flex items-center";
  const buttonAndCursorClass = cc([buttonClass, "cursor-pointer"]);

  const onClickHandler = () => {
    if (onClickOverride) onClickOverride(ensName);
    else {
      window.location.href = `https://nameguard.io/inspect/${encodeURIComponent(
        ensName.name,
      )}`;
    }
  };

  const invisibleNameWidthTester = useRef<null | HTMLParagraphElement>(null);

  /* 
    Below state is only true if the ensName displayed is longer 
    than badge's ensName max-width (defined by MAX_ENSNAME_DISPLAY_WIDTH)
  */
  const [displayFullNameInTooltip, setDisplayFullNameInTooltip] = useState<
    null | boolean
  >(null);

  useEffect(() => {
    if (data) {
      if (data.name !== ensName.name) {
        throw new Error(
          `The data received is from: ${data.name} and not for the provided ensName, which is ${ensName.name}`,
        );
      }
    }
  }, [data]);

  useEffect(() => {
    if (invisibleNameWidthTester && invisibleNameWidthTester.current) {
      const nameIsBiggerThanBadgeMax =
        Math.ceil(
          invisibleNameWidthTester.current.getBoundingClientRect().width,
        ) > maxEnsNameDisplayWidth;

      setDisplayFullNameInTooltip(nameIsBiggerThanBadgeMax);
    }
  }, [invisibleNameWidthTester]);

  const showUnnormalizedName =
    displayUnnormalizedNames &&
    ensName.normalization === Normalization.unnormalized;
  const displayName = showUnnormalizedName ? ensName.name : ensName.displayName;

  return (
    <button className={buttonAndCursorClass} onClick={onClickHandler}>
      {/* 
        To ensure a ReportBadge doesn't grow too wide the ensName that is
        actually displayed has a max-width applied by CSS. If the width required
        to display the full ensName exceeds that maximum, CSS automatically
        truncates the displayed name with an ellipsis to ensure it fits within the
        required maximum. If and only if CSS performs this truncation we want to
        provide users with a tooltip on the ReportBadge that allows them to view
        the full ensName. We use the invisible div defined below to check the
        width that would be required to display the full ensName within the badge.
        We can use the width of this invisible div to determine if CSS performed
        truncation and if we should activate the tooltip. 
      */}
      <div className="invisible absolute left-0 top-0 pointer-events-none">
        <div ref={invisibleNameWidthTester}>{displayName}</div>
      </div>
      {/*
        Below HTML is the rendered badge and tooltip, being the
        tooltip only displayed when it is needed. When is it needed?
        Whenever the ensName displayed is longer than MAX_ENSNAME_DISPLAY_WIDTH.
      */}
      {displayFullNameInTooltip === null ? (
        <div className="h-2.5 my-[5px] w-[90px] mr-1.5 bg-gray-100 rounded-lg"></div>
      ) : displayFullNameInTooltip ? (
        <Tooltip
          trigger={
            <div
              style={{ maxWidth: maxEnsNameDisplayWidth }}
              className="cursor-pointer text-black text-sm leading-5 ens-webfont truncate pr-1"
            >
              {displayName}
            </div>
          }
        >
          <span className="text-white text-sm leading-5 ens-webfont">
            {displayName}
          </span>
        </Tooltip>
      ) : (
        <span className="cursor-pointer text-black text-sm leading-5 ens-webfont truncate pr-1.5">
          {displayName}
        </span>
      )}

      {hadLoadingError ? (
        // Unknown Rating
        <UnknownReportIcon
          size={RatingIconSize.micro}
          className="cursor-pointer"
        >
          <div className="text-sm text-white">
            <button
              className="appearance-none underline font-medium"
              onClick={onClickHandler}
            >
              Inspect name for details
            </button>
          </div>
        </UnknownReportIcon>
      ) : !data ? (
        // Loading Rating
        <RatingLoadingIcon
          size={RatingIconSize.small}
          className={"cursor-pointer"}
        />
      ) : (
        // Known Rating
        <ReportIcon
          data={data}
          ensName={ensName}
          isInteractive={true}
          size={RatingIconSize.micro}
          className={"cursor-pointer"}
          hadLoadingError={hadLoadingError}
        />
      )}
    </button>
  );
}
