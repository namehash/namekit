"use client";

import { Rating, type SecurePrimaryNameResult } from "@namehash/nameguard";
import {
  RatingIcon,
  RatingIconSize,
  RatingLoadingIcon,
  ratingTextColor,
} from "@namehash/nameguard-react";
import { Tooltip } from "@namehash/namekit-react/client";
import cc from "classcat";

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

  const { nameguard_report } = data;

  if (!nameguard_report)
    return <RatingLoadingIcon size={RatingIconSize.micro} />;

  const textClass = cc([
    "font-semibold",
    ratingTextColor(nameguard_report.rating),
  ]);

  return (
    <Tooltip
      trigger={
        <RatingIcon
          rating={nameguard_report.rating}
          size={RatingIconSize.micro}
        />
      }
    >
      <div className="hidden md:flex items-start space-x-3 py-2.5 min-w-[300px]">
        <div className="mt-0.5">
          <RatingIcon
            rating={nameguard_report.rating}
            size={RatingIconSize.micro}
          />
        </div>

        <div className="space-y-1.5 flex-1">
          <div className="flex items-center justify-between">
            <span className={textClass}>
              {nameguard_report.highest_risk?.check_name}
            </span>
            <span className="text-sm font-normal text-gray-400">
              {nameguard_report.risk_count} risk
              {(nameguard_report.risk_count || 0) >= 0 && "s"} detected
            </span>
          </div>
          <div className="space-y-0.5">
            <div className="text-sm text-white">
              {nameguard_report.highest_risk?.message}
            </div>
            <div className="text-sm text-white">
              <a
                href={`https://nameguard.io/inspect/${encodeURIComponent(
                  nameguard_report.name,
                )}`}
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
