"use client";
import { type ConsolidatedNameGuardReport } from "@namehash/nameguard";
import React, { useEffect, useState, useRef } from "react";
import cc from "classcat";

import { ReportIcon } from "../ReportIcon/index";
import { RatingLoadingIcon, RatingIconSize, Tooltip } from "../..";
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

  const nameRef = useRef<null | HTMLParagraphElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    console.log(nameRef);
    if (nameRef && nameRef.current) {
      const nameIsBiggerThanPillShows =
        Math.round(nameRef.current.scrollWidth) >
        Math.round(nameRef.current.getBoundingClientRect().width);

      setShowTooltip(!!nameIsBiggerThanPillShows);
    }
  }, [nameRef]);

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
      <>
        {/*
          Below HTML is used for comparing wether name is
          using ellipsis in Ui or not. This is important
          for displaying tooltip whenever name is longer
          than the pill itself (name shows ellipsis).
        */}
        <div className="invisible absolute left-0 top-0 pointer-events-none">
          <div ref={nameRef}>{data.beautiful_name || data.name}</div>
        </div>

        {/*
          Below HTML is the rendered Account Pill and Account tooltip,
          which is displayed only when needed. When is it needed?
          Whenever the primary name is longer than the pill itself.
        */}
        {showTooltip ? (
          <Tooltip
            trigger={
              <span className="text-black text-sm leading-5 ens-webfont max-w-[202px] truncate tultipe">
                {data.beautiful_name || data.name}
              </span>
            }
          >
            <span className="text-black text-sm leading-5 ens-webfont">
              {data.beautiful_name || data.name}
            </span>
          </Tooltip>
        ) : (
          <span className="text-black text-sm leading-5 ens-webfont max-w-[202px] truncate">
            {data.beautiful_name || data.name}
          </span>
        )}
      </>
      <ReportIcon
        data={data}
        size={RatingIconSize.micro}
        className={"cursor-pointer"}
        hadLoadingError={hadLoadingError}
      />
    </button>
  );
}
