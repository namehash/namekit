"use client";
import { type ConsolidatedNameGuardReport } from "@namehash/nameguard";
import React, { useEffect } from "react";
import cc from "classcat";

import { ReportIcon } from "../ReportIcon/index";
import {
  RatingLoadingIcon,
  RatingIconSize,
  Tooltip,
  DisplayedName,
} from "../..";
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
  maxDisplayWidth?: number;
}

export function ReportBadge({
  data,
  ensName,
  maxDisplayWidth,
  onClickOverride,
  hadLoadingError = false,
  displayUnnormalizedNames = false,
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

  useEffect(() => {
    if (data) {
      if (data.name !== ensName.name) {
        throw new Error(
          `The data received is from: ${data.name} and not for the provided ensName, which is ${ensName.name}`,
        );
      }
    }
  }, [data]);

  return (
    <button className={buttonAndCursorClass} onClick={onClickHandler}>
      <DisplayedName
        textStylingClasses="cursor-pointer"
        displayUnnormalizedNames={displayUnnormalizedNames}
        maxDisplayWidth={maxDisplayWidth}
        name={ensName}
      />

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
          size={RatingIconSize.micro}
          className="cursor-pointer"
        />
      ) : (
        // Known Rating
        <ReportIcon
          data={data}
          ensName={ensName}
          isInteractive={true}
          /*
            Since the ReportBadge has already executed the onClickHandler
            function when the user clicks on it, there is no need to execute
            it once again inside the ReportIcon component. Therefore, we
            override the onClick function of the ReportIcon component 
            to do nothing when the user clicks on it ⬇️
          */
          onClickOverride={() => {}}
          size={RatingIconSize.micro}
          className={"cursor-pointer"}
          hadLoadingError={hadLoadingError}
        />
      )}
    </button>
  );
}
