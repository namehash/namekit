"use client";

import { type SecurePrimaryNameResult } from "@namehash/nameguard";
import {
  RatingIcon,
  RatingIconSize,
  getReportURL,
  ratingTextColor,
  RatingLoadingIcon,
} from "@namehash/nameguard-react";
import cc from "classcat";

import { Tooltip } from "./Tooltip";
import { buildENSName } from "@namehash/ens-utils";

type ImpersonationReportProps = {
  data?: SecurePrimaryNameResult;
};

export function ImpersonationReport({ data }: ImpersonationReportProps) {
  if (
    !data ||
    data?.impersonation_status === null ||
    data?.impersonation_status === "unlikely"
  )
    return null;

  const { nameguard_result } = data;

  if (!nameguard_result)
    return <RatingLoadingIcon size={RatingIconSize.micro} />;

  const textClass = cc([
    "font-semibold",
    ratingTextColor(nameguard_result.rating),
  ]);

  return (
    <Tooltip
      trigger={
        <RatingIcon
          rating={nameguard_result.rating}
          size={RatingIconSize.micro}
        />
      }
    >
      <div className="hidden md:flex items-start space-x-3 py-2.5 min-w-[300px]">
        <div className="mt-0.5">
          <RatingIcon
            rating={nameguard_result.rating}
            size={RatingIconSize.micro}
          />
        </div>

        <div className="space-y-1.5 flex-1">
          <div className="flex items-center justify-between">
            <span className={textClass}>
              {nameguard_result.highest_risk?.check_name}
            </span>
            <span className="text-sm font-normal text-gray-400">
              {nameguard_result.risk_count} risk
              {(nameguard_result.risk_count || 0) >= 0 && "s"} detected
            </span>
          </div>
          <div className="space-y-0.5">
            <div className="text-sm text-white">
              {nameguard_result.highest_risk?.message}
            </div>
            <div className="text-sm text-white">
              <a
                href={
                  getReportURL(buildENSName(nameguard_result.name)).href
                }
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
