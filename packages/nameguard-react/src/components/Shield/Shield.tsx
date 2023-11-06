import React from "react";
import useSWR from "swr";
import {
  nameguard,
  type NameGuardReport,
  type Rating,
} from "@namehash/nameguard";
import { parseName } from "@namehash/nameparser";
import cc from "classcat";

import { Shield as ShieldIcon } from "../Report/Shield";
import { Tooltip } from "../Tooltip/Tooltip";

function textColor(rating: Rating) {
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

type ShieldProps = {
  name?: string;
};

export const Shield = ({ name }: ShieldProps) => {
  if (!name) return null;

  const { data, error, isLoading } = useSWR<NameGuardReport>(
    name,
    (n: string) => nameguard.inspectName(parseName(n).outputName.name)
  );

  const textClass = cc(["font-semibold", textColor(data.rating)]);

  return (
    <Tooltip
      trigger={
        <ShieldIcon status={isLoading ? "info" : data.rating} size="small" />
      }
    >
      <div className="hidden md:flex items-start space-x-3 py-2.5 min-w-[300px]">
        <ShieldIcon status={isLoading ? "info" : data.rating} size="small" />

        <div className="space-y-1.5 flex-1">
          <div className="flex items-center justify-between">
            <span className={textClass}>{data.title}</span>
            <span className="text-sm font-normal text-gray-400">
              {data.risk_count} risk{data.risk_count >= 0 && "s"} detected
            </span>
          </div>
          <div className="text-sm text-white">{data.subtitle}</div>
        </div>
      </div>
    </Tooltip>
  );
};
