"use client";

import { type ConsolidatedNameGuardReport } from "@namehash/nameguard";
import { ENSName } from "@namehash/ens-utils";
import React from "react";

import { ReportIcon } from "../ReportIcon/index";
import { RatingIconSize, DisplayedName } from "../..";
import { OpenReportHandler, openReport } from "../../utils/openreport";

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

  /*
    Below number is a measure of the maximum width that the ensName 
    should have inside ReportBadge. If the ensName displayed is longer 
    than this number, the badge will truncate the ensName and display a 
    tooltip on hover that shows the full ensName. This number is measured in pixels.
  */
  maxDisplayWidth?: number;
  onOpenReport?: OpenReportHandler;
}

const DEFAULT_MAX_ENSNAME_DISPLAY_WIDTH = 200;

export function ReportBadge({
  data,
  ensName,
  hadLoadingError = false,
  displayUnnormalizedNames = false,
  maxDisplayWidth = DEFAULT_MAX_ENSNAME_DISPLAY_WIDTH,
  onOpenReport,
}: ReportBadgeProps) {

  return (
    <button onClick={() => openReport(ensName, onOpenReport)}
      className={
        "flex-shrink-0 appearance-none bg-white transition-colors hover:bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1.5 inline-flex items-center"
      }
    >
      <DisplayedName
        textStylingClasses="cursor-pointer pr-1.5" // TODO: It's interesting that "cursor-pointer" is needed for the case that the `TruncatedText` for the `DisplayedName` overflows. Does this reflect an opportunity to refine `DisplayedName` or `TruncatedText`?
        displayUnnormalizedNames={displayUnnormalizedNames}
        maxDisplayWidth={maxDisplayWidth}
        name={ensName}
      />

      <ReportIcon
        data={data}
        ensName={ensName}
        size={RatingIconSize.micro}
        hadLoadingError={hadLoadingError}
        onOpenReport={(ensName: ENSName) => {
          // do nothing, let the click pass through to our outer <button>
        }}
      />
    </button>
  );
}
