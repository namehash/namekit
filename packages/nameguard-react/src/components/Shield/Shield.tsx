import type { ReactNode } from "react";
import React from "react";
import useSWR from "swr";
import {
  nameguard,
  Rating,
  type BulkConsolidatedNameGuardReport,
  CheckResultCode,
} from "@namehash/nameguard";
import { parseName } from "@namehash/ens-utils";
import cc from "classcat";

import { Shield as ShieldIcon } from "../Report/Shield";
import { Tooltip } from "../Tooltip/Tooltip";
import { ShieldError } from "./Error";

function textColor(rating: Rating) {
  switch (rating) {
    case Rating.alert: {
      return "text-red-600";
    }
    case Rating.pass: {
      return "text-emerald-600";
    }
    case Rating.warn: {
      return "text-amber-500";
    }
    default: {
      return "text-gray-500";
    }
  }
}

type ShieldProps = {
  name?: string;
  children?: ReactNode;
  size?: "small" | "medium" | "large" | "micro";
};

export const Shield = ({ name, children, size }: ShieldProps) => {
  if (!name) return null;

  const { data, error, isLoading } = useSWR<BulkConsolidatedNameGuardReport>(
    name,
    (n: string) => nameguard.bulkInspectNames([parseName(n).outputName.name])
  );

  const result = data?.results[0];

  const status = isLoading
    ? CheckResultCode.info
    : result.highest_risk
    ? result.highest_risk.status
    : CheckResultCode.info;

  if (isLoading || !data) {
    return (
      <ShieldIcon
        status={status}
        className={isLoading && "animate-pulse"}
        size={size}
      />
    );
  }

  if (error) {
    return <ShieldError size={size}>{children}</ShieldError>;
  }

  const textClass = cc(["font-semibold mb-1", textColor(result.rating)]);

  return (
    <Tooltip trigger={<ShieldIcon status={status} size={size} />}>
      <div className="hidden md:flex items-start space-x-3 py-2.5 min-w-[300px]">
        <ShieldIcon status={status} size={size} />

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className={textClass}>{result.title}</span>
            {result.risk_count >= 1 && (
              <span className="text-sm font-normal text-gray-400">
                {result.risk_count} risk{result.risk_count === 1 ? "" : "s"}{" "}
                detected
              </span>
            )}
          </div>
          <div className="text-sm text-white">{result.subtitle}</div>
          {children}
        </div>
      </div>
    </Tooltip>
  );
};
