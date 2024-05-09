"use client";
import { type ConsolidatedNameGuardReport } from "@namehash/nameguard";
import React, { useEffect, useState, useRef } from "react";
import cc from "classcat";

import { ReportIcon } from "../ReportIcon/index";
import { RatingLoadingIcon, RatingIconSize, Tooltip } from "../..";
import { UnknownReportShield } from "../UnknownReportShield/UnknownReportShield";
import { ENSName } from "@namehash/ens-utils";

interface ReportBadgeProps {
  onClickOverride?: () => any;

  /*
    The data prop is the consolidated report for the ensName.
    The ensName prop is the ENSName object.

    The data prop should always be relative to the ensName prop.
    This means that the data prop should always be the report for
    the ensName provided in the ensName prop.
  */
  ensName: ENSName;
  data?: ConsolidatedNameGuardReport;

  hadLoadingError?: boolean;
}

const MAX_TOOLTIP_WIDTH = 202;

export function ReportBadge({
  ensName,
  data,
  onClickOverride,
  hadLoadingError,
}: ReportBadgeProps) {
  const buttonClass =
    "flex-shrink-0 appearance-none bg-white transition-colors hover:bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1.5 inline-flex items-center";
  const buttonAndCursorClass = cc([buttonClass, "cursor-pointer"]);

  const onClickHandler = () => {
    if (onClickOverride) onClickOverride();
    else {
      window.location.href = `https://nameguard.io/inspect/${encodeURIComponent(
        ensName.name,
      )}`;
    }
  };

  const nameRef = useRef<null | HTMLParagraphElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (data) {
      if (data.name !== ensName.name) {
        throw new Error(
          `The data received is from: ${data.name} and not for the provided ensName, which is ${ensName.name}`,
        );
      }
    }
  }, [data]);

  useEffect(() => {
    if (nameRef && nameRef.current) {
      const nameIsBiggerThanPillShows =
        Math.round(nameRef.current.getBoundingClientRect().width) >
        MAX_TOOLTIP_WIDTH;

      setShowTooltip(!!nameIsBiggerThanPillShows);
    }
  }, [nameRef]);

  if (hadLoadingError)
    return (
      <button className={buttonAndCursorClass} onClick={onClickHandler}>
        <span className="text-black text-sm leading-5 ens-webfont mr-1.5">
          {ensName.displayName}
        </span>
        <UnknownReportShield size="micro" className={"cursor-pointer"}>
          <div className="text-sm text-white">
            <button
              className="appearance-none underline font-medium"
              onClick={onClickHandler}
            >
              Inspect ensName for details
            </button>
          </div>
        </UnknownReportShield>
      </button>
    );

  if (!data)
    return (
      <button className={buttonAndCursorClass} onClick={onClickHandler}>
        <span className="text-black text-sm leading-5 ens-webfont mr-1.5">
          {ensName.displayName}
        </span>
        <RatingLoadingIcon
          size={RatingIconSize.small}
          className={"cursor-pointer"}
        />
      </button>
    );

  return (
    <button className={buttonAndCursorClass} onClick={onClickHandler}>
      {/*
          Below HTML is used for comparing wether ensName is
          using ellipsis in Ui or not. This is important
          for displaying tooltip whenever ensName is longer
          than the badge itself (ensName shows ellipsis).
        */}
      <div className="invisible absolute left-0 top-0 pointer-events-none">
        <div ref={nameRef}>{ensName.displayName}</div>
      </div>

      {/*
          Below HTML is the rendered badge and tooltip, being the
          last one displayed only when needed. When is it needed?
          Whenever the ensName displayed is longer than the badge itself.
        */}
      {showTooltip ? (
        <Tooltip
          trigger={
            <div className="cursor-pointer text-black text-sm leading-5 ens-webfont max-w-[202px] truncate pr-1">
              {ensName.displayName}
            </div>
          }
        >
          <span className="text-white text-sm leading-5 ens-webfont">
            {ensName.displayName}
          </span>
        </Tooltip>
      ) : (
        <span className="cursor-pointer text-black text-sm leading-5 ens-webfont max-w-[202px] truncate pr-1.5">
          {ensName.displayName}
        </span>
      )}
      <ReportIcon
        data={data}
        ensName={ensName}
        size={RatingIconSize.micro}
        className={"cursor-pointer"}
        hadLoadingError={hadLoadingError}
      />
    </button>
  );
}
