import React, { type ReactNode } from "react";
import { ConsolidatedNameGuardReport } from "@namehash/nameguard";
import cc from "classcat";

import { Tooltip } from "../Tooltip/Tooltip";
import {
  ShieldIcon,
  ShieldIconSize,
  getNameGuardRatingTextColors,
} from "../Report/ShieldIcon";
import { LoadingShieldIcon } from "../icons/LoadingShieldIcon";
import { UnknownShieldIcon } from "../icons/UnknownShieldIcon";

type NameShieldProps = {
  data?: ConsolidatedNameGuardReport;
  children?: ReactNode;
  disableHover?: boolean;
  size?: ShieldIconSize;
  error: boolean;
} & React.ComponentProps;

export function ReportShield({
  data,
  error,
  children,
  disableHover,
  size = ShieldIconSize.small,
  ...props
}: NameShieldProps) {
  if (error) {
    return <UnknownShieldIcon size={size} {...props} />;
  }

  if (!data) {
    return <LoadingShieldIcon size={size} {...props} />;
  }

  const { title, subtitle, rating, risk_count, highest_risk } = data;

  const textClass = cc([
    "font-semibold mb-1",
    getNameGuardRatingTextColors(rating),
  ]);

  if (disableHover) {
    return <ShieldIcon rating={rating} size={size} {...props} />;
  }

  return (
    <Tooltip trigger={<ShieldIcon rating={rating} size={size} {...props} />}>
      <div className="flex items-start space-x-3 py-2.5 min-w-[300px] max-w-[300px]">
        <div className="mt-0.5">
          <ShieldIcon rating={rating} size={ShieldIconSize.small} />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className={textClass}>{title}</span>
            {risk_count >= 1 && (
              <span className="text-sm font-normal text-gray-400">
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
