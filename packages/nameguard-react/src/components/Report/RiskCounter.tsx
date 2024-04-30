import React from "react";
import cc from "classcat";
import {
  CheckResultCode,
  ConsolidatedGraphemeGuardReport,
} from "@namehash/nameguard";
import { checkResultCodeTextColor } from "../../utils/text";

export function RiskCounter({
  count,
}: {
  count: ConsolidatedGraphemeGuardReport["risk_count"];
}) {
  if (count === 0 || count === 1) return null;

  return (
    <span
      className={cc([
        "bg-yellow-100 rounded-full px-3 py-0.5 text-xs md:text-sm font-medium",
        checkResultCodeTextColor(CheckResultCode.warn),
      ])}
    >
      + {count - 1} more risk{count - 1 >= 2 && "s"}
    </span>
  );
}
