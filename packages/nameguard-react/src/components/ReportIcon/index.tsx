"use client";

import React, { useEffect } from "react";
import {
  CheckResultCode,
  ConsolidatedNameGuardReport,
} from "@namehash/nameguard";
import cc from "classcat";
import { ENSName } from "@namehash/ens-utils";

import { Link } from "@namehash/namekit-react";

import { Tooltip } from "@namehash/namekit-react/client";
import { RatingLoadingIcon } from "../icons/RatingLoadingIcon";
import { RatingIcon, RatingIconSize } from "../Report/RatingIcon";
import { checkResultCodeTextColor, ratingTextColor } from "../../utils/text";
import { UnknownReportIcon } from "../UnknownReportIcon/UnknownReportIcon";

type ReportIconProps = {
  onClickOverride?: (ensName: ENSName) => void;

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

export function ReportIcon({
  ensName,
  data,
  onClickOverride,
  hadLoadingError,
  size = RatingIconSize.small,

  /*
    Props are applied to the shield icon which is the onHover trigger element
    for the tooltip with Report information. For examples, please visit the
    https://nameguard.io/docs/report and see the ReportIcon docs. Any
    additional props are passed to the shield icon that when hovered,
    displays the tooltip with the report information.
  */
  ...props
}: ReportIconProps) {
  const onClickHandler = () => {
    if (onClickOverride) onClickOverride(ensName);
    else {
      window.location.href = `https://nameguard.io/inspect/${encodeURIComponent(
        ensName.name,
      )}`;
    }
  };

  if (hadLoadingError) {
    return (
      <UnknownReportIcon
        size={size}
        onClick={onClickHandler}
        className="cursor-pointer"
      >
        <Link onClick={onClickHandler} variant="underline" size="small">
          Inspect name for details
        </Link>
      </UnknownReportIcon>
    );
  }

  if (!data) {
    return (
      <RatingLoadingIcon
        onClick={onClickHandler}
        className={cc([props.className, " cursor-pointer"])}
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

  const textClass = cc(["font-semibold", ratingTextColor(rating)]);

  return (
    <Tooltip
      trigger={
        <RatingIcon
          role="button"
          isInteractive={true}
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
          <div className="flex items-center justify-between mb-1">
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

          <Link onClick={onClickHandler} variant="underline" size="small">
            Inspect name for details
          </Link>
        </div>
      </div>
    </Tooltip>
  );
}
