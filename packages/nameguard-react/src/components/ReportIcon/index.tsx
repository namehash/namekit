"use client";

import React, { useEffect } from "react";
import {
  CheckResultCode,
  ConsolidatedNameGuardReport,
} from "@namehash/nameguard";
import cc from "classcat";

import { Tooltip } from "../Tooltip/Tooltip";
import { RatingLoadingIcon } from "../icons/RatingLoadingIcon";
import { RatingUnknownIcon } from "../icons/RatingUnknownIcon";
import { RatingIcon, RatingIconSize } from "../Report/RatingIcon";
import { checkResultCodeTextColor, ratingTextColor } from "../../utils/text";
import { ENSName } from "@namehash/ens-utils";
import { UnknownReportShield } from "../UnknownReportShield/UnknownReportShield";

type ReportShieldProps = {
  onClickOverride?: () => any;

  /*
    The data prop is the consolidated report for the ensName.
    The ensName prop is the ENSName object.

    The data prop should always be relative to the ensName prop.
    This means that the data prop should always be the report for
    the ensName provided in the ensName prop.
  */
  ensName: ENSName;
  data?: ConsolidatedNameGuardReport;

  hadLoadingError: boolean;
  size?: RatingIconSize;
} & React.ComponentProps;

declare global {
  interface Window {
    location: Location;
  }
}

export function ReportIcon({
  ensName,
  data,
  onClickOverride,
  hadLoadingError,
  size = RatingIconSize.small,
  ...props
}: ReportShieldProps) {
  const onClickHandler = () => {
    if (onClickOverride) onClickOverride();
    else {
      window.location.href = `https://nameguard.io/inspect/${encodeURIComponent(
        ensName.name,
      )}`;
    }
  };

  if (hadLoadingError) {
    return (
      <UnknownReportShield
        size={size}
        onClick={onClickHandler}
        className={"cursor-pointer"}
        {...props}
      >
        <div className="text-sm text-white">
          <button
            className="appearance-none underline font-medium"
            onClick={onClickHandler}
          >
            Inspect ensName for details
          </button>
        </div>
      </UnknownReportShield>
    );
  }

  if (!data) {
    return (
      <RatingLoadingIcon
        onClick={onClickHandler}
        className={cc([
          props.className
            ? props.className + " cursor-pointer"
            : "cursor-pointer",
        ])}
        size={size}
        {...props}
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
          onClick={onClickHandler}
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
              onClick={onClickHandler}
            >
              Inspect name for details
            </button>
          </div>
        </div>
      </div>
    </Tooltip>
  );
}
