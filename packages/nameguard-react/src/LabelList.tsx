import React, { Fragment } from "react";
import type { NameGuardReport } from "@namehash/nameguard";
import { ShieldExclamationIcon } from "@heroicons/react/20/solid";

import { NoGraphemesWarning } from "./NoGraphemesWarning";
import { GraphemeCard } from "./GraphemeCard";

type LabelListProps = {
  items?: NameGuardReport["labels"];
};

export function LabelList({ items = [] }: LabelListProps) {
  const rawLabels = items.map((i) => i.label) ?? [];

  return items?.map((label, index) => {
    const unknown = label.normalization === "unknown";
    const empty = label.label === "";

    return (
      <div
        key={index}
        className="border border-gray-200 rounded-md divide-y divide-gray-200"
      >
        <div className="py-[10px] px-6 md:flex md:items-center md:justify-between space-y-1 md:space-y-0">
          <div className="text-sm font-normal break-all">
            {rawLabels.map((l, index) => (
              <Fragment key={index}>
                <span
                  className={
                    l === label.label
                      ? "text-black font-semibold"
                      : "text-gray-500 grayscale"
                  }
                >
                  {l === "" ? "[empty]" : l}
                </span>
                {index < rawLabels.length - 1 && (
                  <span className="text-gray-500">.</span>
                )}
              </Fragment>
            ))}
          </div>
          {(label.normalization === "unnormalized" ||
            label.normalization === "unknown") && (
            <div className="flex items-center space-x-2">
              <ShieldExclamationIcon className="w-4 h-4 text-red-600 fill-current" />
              <span className="text-red-600 text-sm">
                {label.normalization === "unnormalized"
                  ? "Not ENS Normalized"
                  : "Not found"}
              </span>
            </div>
          )}
        </div>
        {unknown && (
          <NoGraphemesWarning
            title="Unknown label"
            description="This part of the name was registered in a way that makes it unknown."
          />
        )}
        {empty && (
          <NoGraphemesWarning
            title="Empty label"
            description="This part of the name is empty."
          />
        )}
        {label?.graphemes?.map((grapheme, index) => (
          <GraphemeCard key={index} {...grapheme} />
        ))}
      </div>
    );
  });
}
