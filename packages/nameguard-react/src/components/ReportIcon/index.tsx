"use client";

import React, { useEffect } from "react";
import {
  CheckResultCode,
  ConsolidatedNameGuardReport,
} from "@namehash/nameguard";
import cc from "classcat";
import { ENSName } from "@namehash/ens-utils";

import { Tooltip } from "@namehash/namekit-react";
import { RatingIcon, RatingIconSize } from "../Report/RatingIcon";
import { checkResultCodeTextColor, ratingTextColor } from "../../utils/text";
import { ReportUnknownIcon } from "../ReportUnknownIcon/ReportUnknownIcon";
import { ReportLoadingIcon } from "../ReportLoadingIcon/ReportLoadingIcon";
import { redirectToViewNameReportURL } from "../../utils/url";

type ReportShieldProps = {
  onIconClickOverride?: (ensName: ENSName) => void;
  onTooltipClickOverride?: (ensName: ENSName) => void;

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
} & React.ComponentProps<"svg">;

declare global {
  interface Window {
    location: Location;
  }
}

enum ClickHandlerFor {
  icon,
  tooltip,
}

export function ReportIcon({
  data,
  ensName,
  hadLoadingError,
  onIconClickOverride,
  onTooltipClickOverride,
  size = RatingIconSize.small,

  /*
    Props are applied to the Report Icon triggeer which is the onHover trigger element 
    for the tooltip with Report information. For examples, please visit the
    https://nameguard.io/docs/report and see the ReportIcon docs. Any 
    additional props received are passed to the Report Icon that when 
    hovered, displays the tooltip with the report information.
  */
  ...props
}: ReportShieldProps) {
  const onClickHandler = (clickHandlerFor: ClickHandlerFor) => {
    switch (clickHandlerFor) {
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

  if (hadLoadingError) {
    return (
      <ReportUnknownIcon
        size={size}
        className="cursor-pointer"
        onIconClickOverride={(e?: React.MouseEvent) => {
          if (e) e.stopPropagation();
          onClickHandler(ClickHandlerFor.icon);
        }}
        onTooltipClickOverride={(e?: React.MouseEvent) => {
          if (e) e.stopPropagation();
          onClickHandler(ClickHandlerFor.tooltip);
        }}
      />
    );
  }

  if (!data) {
    return (
      <ReportLoadingIcon
        size={size}
        className="cursor-pointer"
        onIconClickOverride={(e?: React.MouseEvent) => {
          if (e) e.stopPropagation();
          onClickHandler(ClickHandlerFor.icon);
        }}
        onTooltipClickOverride={(e?: React.MouseEvent) => {
          if (e) e.stopPropagation();
          onClickHandler(ClickHandlerFor.tooltip);
        }}
      />
    );
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

  const { title, subtitle, rating, risk_count, highest_risk } = data;

  const textClass = cc(["font-semibold mb-1", ratingTextColor(rating)]);

  return (
    <Tooltip
      trigger={
        <RatingIcon
          role="button"
          isInteractive={true}
          onClick={(e?: React.MouseEvent) => {
            if (e) e.stopPropagation();
            onClickHandler(ClickHandlerFor.icon);
          }}
          className="cursor-pointer"
          rating={rating}
          size={size}
          {...props}
        />
      }
    >
      <div className="flex items-start space-x-3 py-2.5 min-w-[300px] max-w-[300px]">
        <div className="mt-0.5">
          <RatingIcon rating={rating} size={RatingIconSize.small} />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className={textClass}>{title}</span>
            {risk_count >= 1 && (
              <span
                className={cc([
                  "text-sm font-normal",
                  checkResultCodeTextColor(CheckResultCode.info),
                ])}
              >
                {risk_count} risk{risk_count !== 1 && "s"} detected
              </span>
            )}
          </div>

          <div className="text-left text-sm text-white font-normal">
            {highest_risk?.message || subtitle}
          </div>

          <div className="text-sm text-white">
            <button
              className="appearance-none underline font-medium"
              onClick={(e?: React.MouseEvent) => {
                if (e) e.stopPropagation();
                onClickHandler(ClickHandlerFor.tooltip);
              }}
            >
              Inspect name for details
            </button>
          </div>
        </div>
      </div>
    </Tooltip>
  );
}
