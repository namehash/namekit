import { type ConsolidatedNameGuardReport } from "@namehash/nameguard";
import React from "react";
import cc from "classcat";

import { ReportIcon } from "../ReportIcon/index";
import { RatingLoadingIcon, RatingIconSize } from "../..";
import { UnknownReportShield } from "../UnknownReportShield/UnknownReportShield";

interface ReportBadgeProps {
  name: string;
  onClick?: () => any;
  data?: ConsolidatedNameGuardReport;
  hadLoadingError?: boolean;
}

export function ReportBadge({
  name,
  data,
  onClick,
  hadLoadingError,
}: ReportBadgeProps) {
  const buttonClass =
    "flex-shrink-0 appearance-none bg-white transition-colors hover:bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1.5 space-x-1.5 inline-flex items-center";
  const buttonAndCursorClass = cc([buttonClass, "cursor-pointer"]);

  const onClickHandler = () => {
    if (onClick) onClick();
    else {
      window.location.href = `https://nameguard.io/inspect/${encodeURIComponent(
        data.name,
      )}`;
    }
  };

  if (hadLoadingError)
    return (
      <button className={buttonAndCursorClass} onClick={onClickHandler}>
        <span className="text-black text-sm leading-5 ens-webfont">{name}</span>
        <UnknownReportShield size="micro" className={"cursor-pointer"}>
          <div className="text-sm text-white">
            <button
              className="appearance-none underline font-medium"
              onClick={onClickHandler}
            >
              Inspect name for details
            </button>
          </div>
        </UnknownReportShield>
      </button>
    );

  if (!data)
    return (
      <button className={buttonAndCursorClass} onClick={onClickHandler}>
        <span className="text-black text-sm leading-5 ens-webfont">{name}</span>
        <RatingLoadingIcon
          size={RatingIconSize.small}
          className={"cursor-pointer"}
        />
      </button>
    );

  return (
    <button className={buttonAndCursorClass} onClick={onClickHandler}>
      <span className="text-black text-sm leading-5 ens-webfont">
        {data.beautiful_name || data.name}
      </span>
      <ReportIcon
        data={data}
        size={RatingIconSize.micro}
        className={"cursor-pointer"}
        hadLoadingError={hadLoadingError}
      >
        <div className="text-sm text-white">
          <button
            className="appearance-none underline font-medium"
            onClick={onClickHandler}
          >
            Inspect name for details
          </button>
        </div>
      </ReportIcon>
    </button>
  );
}
