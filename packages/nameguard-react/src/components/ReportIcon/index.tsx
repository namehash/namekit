import React from "react";
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

type ReportShieldProps = {
  onClick?: () => any;
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
  data,
  onClick,
  hadLoadingError,
  size = RatingIconSize.small,
  ...props
}: ReportShieldProps) {
  if (hadLoadingError) {
    return <RatingUnknownIcon size={size} {...props} />;
  }

  if (!data) {
    return <RatingLoadingIcon size={size} {...props} />;
  }

  const { title, subtitle, rating, risk_count, highest_risk } = data;

  const textClass = cc(["font-semibold mb-1", ratingTextColor(rating)]);

  const onClickHandler = () => {
    if (onClick) onClick();
    else {
      window.location.href = `https://nameguard.io/inspect/${encodeURIComponent(
        data.name,
      )}`;
    }
  };

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
