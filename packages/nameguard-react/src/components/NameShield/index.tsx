import React, { type ReactNode } from "react";
import { ConsolidatedNameGuardReport } from "@namehash/nameguard";
import cc from "classcat";

import { Tooltip } from "../Tooltip/Tooltip";
import {
  Shield,
  ShieldSize,
  getNameGuardRatingTextColors,
} from "../Report/Shield";
import { LoadingShield } from "../icons/LoadingShield";
import { ErrorShield } from "../icons/ErrorShield";

type NameShieldProps = {
  data?: ConsolidatedNameGuardReport;
  children?: ReactNode;
  disableHover?: boolean;
  size?: ShieldSize;
  error?: string;
} & React.ComponentProps;

export function NameShield({
  data,
  error,
  children,
  disableHover,
  size = ShieldSize.small,
  ...props
}: NameShieldProps) {
  if (error) {
    return <ErrorShield size={size} {...props} />;
  }

  if (!data || !data.rating) {
    return <LoadingShield size={size} {...props} />;
  }

  const { title, subtitle, rating, risk_count, highest_risk } = data;

  const textClass = cc([
    "font-semibold mb-1",
    getNameGuardRatingTextColors(rating),
  ]);

  if (disableHover) {
    return <Shield status={rating} size={size} {...props} />;
  }

  return (
    <Tooltip trigger={<Shield status={rating} size={size} {...props} />}>
      <div className="flex items-start space-x-3 py-2.5 min-w-[300px] max-w-[300px]">
        <div className="mt-0.5">
          <Shield status={rating} size={ShieldSize.small} />
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
