import React from "react";
import { ConsolidatedGraphemeGuardReport } from "@namehash/nameguard";

export function RiskCounter({
  count,
}: {
  count: ConsolidatedGraphemeGuardReport["risk_count"];
}) {
  if (count === 0 || count === 1) return null;

  return (
    <span className="ng-bg-yellow-100 ng-rounded-full ng-px-3 ng-py-0.5 ng-text-xs md:ng-text-sm ng-font-medium ng-text-yellow-800">
      + {count - 1} more risk{count - 1 >= 2 && "s"}
    </span>
  );
}
