import React from "react";
import { ConsolidatedGraphemeGuardReport } from "@namehash/nameguard";

export function RiskCounter({
  count,
}: {
  count: ConsolidatedGraphemeGuardReport["risk_count"];
}) {
  if (count === 0 || count === 1) return null;

  return (
    <span className="bg-yellow-100 rounded-full px-3 py-0.5 text-xs md:text-sm font-medium text-yellow-800">
      + {count - 1} more risk{count - 1 >= 2 && "s"}
    </span>
  );
}
