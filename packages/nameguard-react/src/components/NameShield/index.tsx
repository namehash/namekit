import React, { type ReactNode } from "react";
import type { ConsolidatedNameGuardReport, Rating } from "@namehash/nameguard";
import cc from "classcat";

import { Tooltip } from "../Tooltip/Tooltip";
import { Shield } from "../Report/Shield";

function textColor(rating?: Rating) {
  switch (rating) {
    case "alert": {
      return "text-red-600";
    }
    case "pass": {
      return "text-emerald-600";
    }
    case "warn": {
      return "text-amber-500";
    }
    default: {
      return "text-gray-500";
    }
  }
}

type NameShieldProps = {
  data?: ConsolidatedNameGuardReport;
  children?: ReactNode;
  disableHover?: boolean;
  size?: "small" | "medium" | "large" | "micro";
} & React.ComponentProps<typeof Shield>;

export function NameShield({
  data,
  children,
  disableHover,
  size = "small",
  ...props
}: NameShieldProps) {
  if (!data) return null;

  const { title, subtitle, rating, risk_count, highest_risk } = data;

  const textClass = cc(["font-semibold mb-1", textColor(rating)]);

  if (!rating) {
    return <Shield status="info" size={size} {...props} />;
  }

  if (disableHover) {
    return <Shield status={rating} size={size} {...props} />;
  }

  return (
    <Tooltip trigger={<Shield status={rating} size={size} {...props} />}>
      <div className="flex items-start space-x-3 py-2.5 min-w-[300px] max-w-[300px]">
        <div className="mt-0.5">
          <Shield status={rating} size="small" />
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
