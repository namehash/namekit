"use client";
import { type ConsolidatedNameGuardReport } from "@namehash/nameguard";
import { ENSName } from "@namehash/ens-utils";
import React, { useEffect } from "react";
import cc from "classcat";

import { ReportIcon } from "../ReportIcon/index";
import { DisplayedName, RatingIconSize } from "../..";
import { redirectToViewNameReportURL } from "../../utils/url";
import { ReportUnknownIcon } from "../ReportUnknownIcon/ReportUnknownIcon";
import { ReportLoadingIcon } from "../ReportLoadingIcon/ReportLoadingIcon";

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

  onIconClickOverride?: (ensName: ENSName) => void;
  onBadgeClickOverride?: (ensName: ENSName) => void;
  onTooltipClickOverride?: (ensName: ENSName) => void;

  /*
    Below number is a measure of the maximum width that the ensName 
    should have inside ReportBadge. If the ensName displayed is longer 
    than this number, the badge will truncate the ensName and display a 
    tooltip on hover that shows the full ensName. This number is measured in pixels.
  */
  maxDisplayWidth?: number;
}

const DEFAULT_MAX_ENSNAME_DISPLAY_WIDTH = 200;

enum ClickHandlerFor {
  badge,
  icon,
  tooltip,
}

export function ReportBadge({
  data,
  ensName,
  onIconClickOverride,
  onBadgeClickOverride,
  onTooltipClickOverride,
  hadLoadingError = false,
  displayUnnormalizedNames = false,
  maxDisplayWidth = DEFAULT_MAX_ENSNAME_DISPLAY_WIDTH,
}: ReportBadgeProps) {
  const buttonClass =
    "flex-shrink-0 appearance-none bg-white transition-colors hover:bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1.5 inline-flex items-center";
  const buttonAndCursorClass = cc([buttonClass, "cursor-pointer"]);

  const onClickHandler = (clickHandlerFor: ClickHandlerFor) => {
    switch (clickHandlerFor) {
      case ClickHandlerFor.badge:
        if (onBadgeClickOverride) {
          onBadgeClickOverride(ensName);
        } else {
          redirectToViewNameReportURL(ensName);
        }
        break;
      case ClickHandlerFor.icon:
        if (onIconClickOverride) {
          onIconClickOverride(ensName);
        } else {
          redirectToViewNameReportURL(ensName);
        }
        break;
      case ClickHandlerFor.tooltip:
        if (onTooltipClickOverride) {
          onTooltipClickOverride(ensName);
        } else {
          redirectToViewNameReportURL(ensName);
        }
        break;
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
    <button
      className={buttonAndCursorClass}
      onClick={() => {
        onClickHandler(ClickHandlerFor.badge);
      }}
    >
      <DisplayedName
        textStylingClasses="cursor-pointer pr-1.5"
        displayUnnormalizedNames={displayUnnormalizedNames}
        maxDisplayWidth={maxDisplayWidth}
        name={ensName}
      />

      {hadLoadingError ? (
        // Unknown Rating
        <ReportUnknownIcon
          className="cursor-pointer"
          size={RatingIconSize.micro}
          onIconClickOverride={() => {
            onClickHandler(ClickHandlerFor.icon);
          }}
          onTooltipClickOverride={() => {
            onClickHandler(ClickHandlerFor.tooltip);
          }}
        />
      ) : !data ? (
        // Loading Rating
        <ReportLoadingIcon
          className="cursor-pointer"
          size={RatingIconSize.micro}
          onIconClickOverride={() => {
            onClickHandler(ClickHandlerFor.icon);
          }}
          onTooltipClickOverride={() => {
            onClickHandler(ClickHandlerFor.tooltip);
          }}
        />
      ) : (
        // Known Rating
        <ReportIcon
          data={data}
          ensName={ensName}
          className="cursor-pointer"
          size={RatingIconSize.micro}
          hadLoadingError={hadLoadingError}
          onIconClickOverride={() => {
            onClickHandler(ClickHandlerFor.icon);
          }}
          onTooltipClickOverride={() => {
            onClickHandler(ClickHandlerFor.tooltip);
          }}
        />
      )}
    </button>
  );
}
