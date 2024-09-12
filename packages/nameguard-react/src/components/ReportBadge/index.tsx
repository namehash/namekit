"use client";

import { type ConsolidatedNameGuardReport } from "@namehash/nameguard";
import { ENSName } from "@namehash/ens-utils";
import React from "react";

import { ReportIcon } from "../ReportIcon/index";
import { RatingIconSize, DisplayedName } from "../..";
import { OpenReportHandler, openReport } from "../../utils/openreport";

export interface ReportBadgeProps {
  /**
   * The `ENSName` that this `ReportBadge` is related to.
   *
   * Used to provide functionality even when the `data` prop is `undefined`.
   * (such as during data loading).
   */
  name: ENSName;

  /**
   * - If `undefined` and `hasLoadingError` is `false`:
   *   - The component will display a loading state.
   * - If `undefined` and `hasLoadingError` is `true`:
   *   - The component will display an unknown state.
   * - If `defined`:
   *   - The component will display a summary of the report contained within `data`.
   *   - The value of `data.name` must be equal to the value of `name.name`.
   *
   * @default undefined
   */
  data?: ConsolidatedNameGuardReport;

  /**
   * - If `true`, the component will display an error state.
   * - The value of this field is only considered if `data` is `undefined`.
   *
   * @default false
   */
  hadLoadingError?: boolean;

  /**
   * - If `true`, the component will display the literal value of `name` even
   *   if it is unnormalized. WARNING: NOT RECOMMENDED. This may display names
   *   that are not "safe".
   * - Otherwise, the component will display "display names" (i.e. normalized
   *   names or a "safe" version of unnormalized names).
   *
   * @default false
   */
  displayUnnormalizedNames?: boolean;

  /**
   * The maximum width that the display of `name` should have inside the
   * `ReportBadge`. If the display of `name` is longer than this number, the
   * badge will truncate the display of `name` and display a tooltip when the
   * name is hovered that displays the full value of `name`. This number is
   * measured in pixels.
   *
   * @default 200
   */
  maxNameDisplayWidth?: number;

  /**
   * The custom `OpenReportHandler` to call when:
   * - The report icon is clicked.
   * - The link to inspect the name for details in the tooltip is clicked.
   * - The badge is clicked.
   *
   * If `undefined`, the default `OpenReportHandler` will be used.
   *
   * @default undefined
   */
  onOpenReport?: OpenReportHandler;
}

const DEFAULT_MAX_NAME_DISPLAY_WIDTH = 200;

export function ReportBadge({
  name,
  data,
  hadLoadingError = false,
  displayUnnormalizedNames = false,
  maxNameDisplayWidth = DEFAULT_MAX_NAME_DISPLAY_WIDTH,
  onOpenReport,
}: ReportBadgeProps) {
  return (
    <button
      onClick={() => openReport(name, onOpenReport)}
      className={
        "flex-shrink-0 appearance-none bg-white transition-colors hover:bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1.5 inline-flex items-center"
      }
    >
      <DisplayedName
        name={name}
        maxDisplayWidth={maxNameDisplayWidth}
        displayUnnormalizedNames={displayUnnormalizedNames}
        // The "cursor-pointer" class is needed for the case that the
        // `TruncatedText` for the `DisplayedName` overflows `maxNameDisplayWidth`.
        textStylingClasses="cursor-pointer pr-1.5"
      />

      <ReportIcon
        name={name}
        data={data}
        size={RatingIconSize.micro}
        hadLoadingError={hadLoadingError}
        onOpenReport={(name: ENSName) => {
          // do nothing, let the click pass through to our outer <button>,
          // otherwise we would process the click twice.
        }}
      />
    </button>
  );
}
