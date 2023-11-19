import React, { type MouseEventHandler } from "react";
import type { ConsolidatedNameGuardReport } from "@namehash/nameguard";

import { NameShield } from "../NameShield";
import { Shield } from "../Report/Shield";

type NameBadgeProps = {
  placeholder?: string;
  data?: ConsolidatedNameGuardReport;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const NameBadge = ({ placeholder, onClick, data }: NameBadgeProps) => {
  if (!data)
    return (
      <button className="flex-shrink-0 appearance-none bg-white transition-colors hover:bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1.5 space-x-1.5 inline-flex items-center">
        {placeholder ? (
          <span className="text-black text-sm leading-5">{placeholder}</span>
        ) : (
          <span className="rounded-full h-2 w-16 bg-gray-200 animate-pulse"></span>
        )}
        <Shield status="info" size="tiny" />
      </button>
    );

  return (
    <button
      className="flex-shrink-0 appearance-none bg-white transition-colors hover:bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1.5 space-x-1.5 inline-flex items-center"
      onClick={onClick}
    >
      <span className="text-black text-sm leading-5">
        {data.beautiful_name || data.name}
      </span>
      <NameShield data={data} />
    </button>
  );
};
