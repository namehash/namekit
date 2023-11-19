import React, { type MouseEventHandler } from "react";
import type { ConsolidatedNameGuardReport } from "@namehash/nameguard";

import { NameShield } from "../NameShield";

type NameBadgeProps = ConsolidatedNameGuardReport & {
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const NameBadge = ({ onClick, ...data }: NameBadgeProps) => {
  if (!data) return null;

  return (
    <button
      className="flex-shrink-0 appearance-none bg-white transition-colors hover:bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1.5 space-x-1.5 inline-flex items-center"
      onClick={onClick}
    >
      <span className="text-black text-sm leading-5">{data.name}</span>
      <NameShield data={data} />
    </button>
  );
};
