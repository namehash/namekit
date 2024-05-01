import React, { type ReactNode } from "react";
import {
  CheckResultCode,
  ConsolidatedNameGuardReport,
} from "@namehash/nameguard";
import cc from "classcat";

import { Tooltip } from "../Tooltip/Tooltip";
import { RatingIcon, RatingIconSize } from "../Report/RatingIcon";
import { LoadingShieldIcon } from "../icons/LoadingShieldIcon";
import { UnknownShieldIcon } from "../icons/UnknownShieldIcon";
import { checkResultCodeTextColor, ratingTextColor } from "../../utils/text";

type ReportShieldProps = {
  data?: ConsolidatedNameGuardReport;
  children?: ReactNode;
  disableHover?: boolean;
  size?: RatingIconSize;
  hadLoadingError: boolean;
} & React.ComponentProps;

export function ReportShield({
  data,
  children,
  disableHover,
  hasLoadingError,
  size = RatingIconSize.small,
  ...props
}: ReportShieldProps) {
  if (hasLoadingError) {
    return <UnknownShieldIcon size={size} {...props} />;
  }

  if (!data) {
    return <LoadingShieldIcon size={size} {...props} />;
  }

  const { title, subtitle, rating, risk_count, highest_risk } = data;

  const textClass = cc(["font-semibold mb-1", ratingTextColor(rating)]);

  if (disableHover) {
    return <RatingIcon rating={rating} size={size} {...props} />;
  }

  return (
    <Tooltip trigger={<RatingIcon rating={rating} size={size} {...props} />}>
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

          <div className="text-sm text-white font-normal">
            {highest_risk?.message || subtitle}
          </div>
          {children}
        </div>
      </div>
    </Tooltip>
  );
}
