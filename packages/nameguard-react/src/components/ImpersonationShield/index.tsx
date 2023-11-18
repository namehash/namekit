import React from "react";
import type { ConsolidatedNameGuardReport, Rating } from "@namehash/nameguard";
import cc from "classcat";

import { Tooltip } from "../Tooltip/Tooltip";
import { Shield } from "../Report/Shield";

function textColor(rating?: Rating) {
  switch (rating) {
    case "alert": {
      return "text-red-700";
    }
    case "pass": {
      return "text-green-700";
    }
    case "warn": {
      return "text-yellow-600";
    }
    default: {
      return "text-gray-500";
    }
  }
}

type ImpersonationShieldProps = {
  data?: ConsolidatedNameGuardReport;
};

export function ImpersonationShield({ data }: ImpersonationShieldProps) {
  if (!data) return null;

  const { title, name, rating, risk_count, highest_risk } = data;

  const textClass = cc(["font-semibold", textColor(rating)]);

  return (
    <Tooltip trigger={<Shield status={rating} size="tiny" />}>
      <div className="hidden md:flex items-start space-x-3 py-2.5 min-w-[300px] max-w-[300px]">
        <div className="mt-0.5">
          <Shield status={rating} size="tiny" />
        </div>

        <div className="space-y-1.5 flex-1">
          <div className="flex items-center justify-between">
            <span className={textClass}>{title}</span>
            <span className="text-sm font-normal text-gray-400">
              {risk_count} risk
              {(risk_count || 0) >= 0 && "s"} detected
            </span>
          </div>
          <div className="space-y-0.5">
            <div className="text-sm text-white">{highest_risk?.message}</div>
            <div className="text-sm text-white">
              <a
                href={`https://nameguard.io/inspect/${name}`}
                className="underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                Inspect name for details
              </a>
            </div>
          </div>
        </div>
      </div>
    </Tooltip>
  );
}
