import React from "react";
import { parseName } from "@namehash/nameparser";

import { Shield } from "../Shield/Shield";

type NameBadgeProps = {
  name?: string;
};

export const NameBadge = ({ name }: NameBadgeProps) => {
  if (!name) return null;

  const {
    outputName: { name: parsedName },
  } = parseName(name);

  return (
    <button className="appearance-none bg-white transition-colors hover:bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1.5 space-x-1.5 inline-flex items-center">
      <span className="text-black text-sm leading-5">{parsedName}</span>
      {/* <Shield name={parsedName} /> */}
    </button>
  );
};
