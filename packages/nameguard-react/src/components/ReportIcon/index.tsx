"use client";

import React, { useEffect } from "react";
import { ConsolidatedNameGuardReport } from "@namehash/nameguard";
import cc from "classcat";
import { ENSName } from "@namehash/ens-utils";

import { Link } from "@namehash/namekit-react";
import { Tooltip } from "@namehash/namekit-react/client";
import { RatingIcon, RatingIconSize } from "../Report/RatingIcon";
import { ratingTextColor } from "../../utils/text";
import { OpenReportHandler, openReport } from "../../utils/openreport";
import { RatingUnknownIcon } from "../icons/RatingUnknownIcon";
import { RatingLoadingIcon } from "../icons/RatingLoadingIcon";

interface ReportShieldProps {
  /**
   * The `ENSName` that this `ReportIcon` is related to.
   *
   * Used to provide functionality even when the `data` prop is `undefined`
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
   * The size of the `RatingIcon` to display.
   *
   * @default RatingIconSize.small
   */
  size?: RatingIconSize;

  /**
   * The custom `OpenReportHandler` to call when:
   * - The report icon is clicked.
   * - The link to inspect the name for details in the tooltip is clicked.
   *
   * If `undefined`, the default `OpenReportHandler` will be used.
   *
   * @default undefined
   */
  onOpenReport?: OpenReportHandler;
}

export function ReportIcon({
  name,
  data,
  hadLoadingError = false,
  size = RatingIconSize.small,
  onOpenReport,

  /*
    Props are applied to the Report Icon triggeer which is the onHover trigger element 
    for the tooltip with Report information. For examples, please visit the
    https://nameguard.io/docs/report and see the ReportIcon docs. Any 
    additional props received are passed to the Report Icon that when 
    hovered, displays the tooltip with the report information.
  */
  ...props
}: ReportShieldProps) {
  useEffect(() => {
    if (data) {
      if (data.name !== name.name) {
        throw new Error(
          `ReportIcon error: The name in the provided data: "${data.name}" does not match the expected name "${name.name}".`,
        );
      }
    }
  }, [data]);

  let icon: React.ReactNode;
  let tooltipIcon: React.ReactNode;
  let tooltipTitleClass: string;
  let tooltipTitle: string;
  let tooltipSubtitle: string | undefined = undefined;
  let tooltipMessage: string | undefined = undefined;

  if (hadLoadingError) {
    icon = <RatingUnknownIcon size={size} isInteractive={true} {...props} />;
    tooltipIcon = <RatingUnknownIcon size={RatingIconSize.small} />;
    tooltipTitleClass = "font-semibold mb-1 text-white";
    tooltipTitle = "Error loading report";
  } else if (!data) {
    // TODO: an isInteractive prop is planned to be added to `RatingLoadingIcon`
    // in https://app.shortcut.com/ps-web3/story/25745/refine-loading-state-of-ratingicon
    icon = <RatingLoadingIcon size={size} {...props} />;
    // TODO: the need to pass this `fill` prop is planned to be removed in
    // https://app.shortcut.com/ps-web3/story/25745/refine-loading-state-of-ratingicon
    tooltipIcon = (
      <RatingLoadingIcon
        size={RatingIconSize.small}
        fill="#dddddd"
        {...props}
      />
    );
    tooltipTitleClass = "font-semibold mb-1 text-white";
    tooltipTitle = "Loading report...";
  } else {
    const { title, subtitle, rating, risk_count, highest_risk } = data;

    icon = (
      <RatingIcon rating={rating} size={size} isInteractive={true} {...props} />
    );
    tooltipIcon = (
      <RatingIcon rating={data.rating} size={RatingIconSize.small} />
    );
    tooltipTitleClass = cc(["font-semibold mb-1", ratingTextColor(rating)]);
    tooltipTitle = title;
    if (risk_count >= 1) {
      tooltipSubtitle = `${risk_count} risk${risk_count !== 1 ? "s" : ""} detected`;
    }
    tooltipMessage = highest_risk?.message || subtitle;
  }

  const iconButton = (
    <div role="button" onClick={() => openReport(name, onOpenReport)}>
      {icon}
    </div>
  );

  const minTooltipWidth = tooltipSubtitle ? 300 : 200;

  // const tooltipClasses = cc([
  //   "flex items-start space-x-3 py-2.5 max-w-[300px]",
  // ]);

  const tooltip = (
    <div className="flex items-start space-x-3 py-2.5 max-w-[300px]" style={{ minWidth: `${minTooltipWidth}px` }}>
      <div className="mt-0.5">{tooltipIcon}</div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className={tooltipTitleClass}>{tooltipTitle}</span>
          {tooltipSubtitle && (
            <span className="text-sm font-normal text-gray-400">
              {tooltipSubtitle}
            </span>
          )}
        </div>

        {tooltipMessage && (
          <div className="text-left text-sm text-white font-normal">
            {tooltipMessage}
          </div>
        )}

        <Link
          onClick={() => openReport(name, onOpenReport)}
          variant="underline"
          size="small"
        >
          Inspect name for details
        </Link>
      </div>
    </div>
  );

  return <Tooltip trigger={iconButton}>{tooltip}</Tooltip>;
}
