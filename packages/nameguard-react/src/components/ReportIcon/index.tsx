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

type ReportShieldProps = {
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
  size?: RatingIconSize;
  onOpenReport?: OpenReportHandler;
} & React.ComponentProps<"svg">;

export function ReportIcon({
  data,
  ensName,
  hadLoadingError,
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
  let icon: React.ReactNode;
  let tooltipIcon: React.ReactNode;
  let tooltipTitleClass: string;
  let tooltipTitle: string;
  let tooltipSubtitle: string | undefined = undefined;
  let tooltipMessage: string | undefined = undefined;

  // TODO: please share advice if we should add `role="button"` to each of the `icon` elements defined below? I saw that applied in the old code. Was it right to remove it?

  if (hadLoadingError) {
    icon = <RatingUnknownIcon size={size} isInteractive={true} {...props} />;
    tooltipIcon = <RatingUnknownIcon size={RatingIconSize.small} />;
    tooltipTitleClass = "font-semibold mb-1 text-white";
    tooltipTitle = "Error loading report";
  } else if (!data) {
    icon = <RatingLoadingIcon size={size} {...props} />; // TODO: add isInteractive={true} prop?
    tooltipIcon = (
      <RatingLoadingIcon
        size={RatingIconSize.small}
        fill="#dddddd"
        {...props}
      />
    ); // TODO: why is it necessary to pass this `fill` prop to make this visible? That's a bad design. It should work properly without needing to pass that.
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
      tooltipSubtitle = `${risk_count} risk${risk_count !== 1 && "s"} detected`;
    }
    tooltipMessage = highest_risk?.message || subtitle;
  }

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
    <Tooltip
      trigger={
        /*
          TODO: Is there a problem making this a <div? Advice appreciated.
          Whatever you suggest, please be sure to test clicking on it on
          `/docs/report`.

          I also added `cursor-pointer` to this div to ensure the hover state UX is correct.
          I tried changing this div to a button, but then started getting errors.
        */
        <div
          onClick={() => openReport(ensName, onOpenReport)}
          className="cursor-pointer"
        >
          {icon}
        </div>
      }
    >
      <div className="flex items-start space-x-3 py-2.5 min-w-[300px] max-w-[300px]">
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
            onClick={() => openReport(ensName, onOpenReport)}
            variant="underline"
            size="small"
          >
            Inspect name for details
          </Link>
        </div>
      </div>
    </Tooltip>
  );
}
