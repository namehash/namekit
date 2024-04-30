import React, { type MouseEventHandler } from "react";
import { type ConsolidatedNameGuardReport } from "@namehash/nameguard";
import cc from "classcat";

import { ReportShield } from "../ReportShield";
import { UnknownShield } from "../Shield/UnknownShield";
import { LoadingShieldIcon, ShieldIconSize } from "../..";

interface NameBadgeProps {
  name?: string;
  data?: ConsolidatedNameGuardReport;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  error?: string;
}

export function NameBadge({ name, onClick, data, error }: NameBadgeProps) {
  const buttonClass =
    "flex-shrink-0 appearance-none bg-white transition-colors hover:bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1.5 space-x-1.5 inline-flex items-center";
  const cursorClass = cc([
    {
      "cursor-pointer": onClick,
      "cursor-default": !onClick,
    },
  ]);
  const buttonAndCursorClass = cc([buttonClass, cursorClass]);

  if (error)
    return (
      <button className={buttonAndCursorClass} onClick={onClick}>
        {name ? (
          <span className="text-black text-sm leading-5 ens-webfont">
            {name}
          </span>
        ) : (
          <span className="rounded-full h-2 w-16 bg-gray-200 animate-pulse"></span>
        )}
        <UnknownShield size="micro" className={cursorClass}>
          {onClick && (
            <div className="text-sm text-white">
              <button
                className="appearance-none underline font-medium"
                onClick={onClick}
              >
                Inspect name for details
              </button>
            </div>
          )}
        </UnknownShield>
      </button>
    );

  if (!data)
    return (
      <button className={buttonAndCursorClass} onClick={onClick}>
        {name ? (
          <span className="text-black text-sm leading-5 ens-webfont">
            {name}
          </span>
        ) : (
          <span className="rounded-full h-2 w-16 bg-gray-200 animate-pulse"></span>
        )}
        <LoadingShieldIcon
          size={ShieldIconSize.small}
          className={cursorClass}
        />
      </button>
    );

  return (
    <button className={buttonAndCursorClass} onClick={onClick}>
      <span className="text-black text-sm leading-5 ens-webfont">
        {data.beautiful_name || data.name}
      </span>
      <ReportShield
        data={data}
        error={!!error}
        size={ShieldIconSize.micro}
        className={cursorClass}
      >
        {onClick && (
          <div className="text-sm text-white">
            <button
              className="appearance-none underline font-medium"
              onClick={onClick}
            >
              Inspect name for details
            </button>
          </div>
        )}
      </ReportShield>
    </button>
  );
}
