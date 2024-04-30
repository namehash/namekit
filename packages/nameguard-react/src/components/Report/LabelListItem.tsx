import cc from "classcat";
import React, { Fragment } from "react";
import { GraphemeList } from "./GraphemeList";
import { NoGraphemesWarning } from "./NoGraphemesWarning";
import { ShieldExclamationIcon } from "@heroicons/react/20/solid";
import { CheckResultCode, NameGuardReport } from "@namehash/nameguard";
import { checkResultCodeTextColor } from "../../utils/text";

type LabelListItemProps = {
  item: NameGuardReport["labels"][0];
  rawLabels?: string[];
  index: number;
};

export const LabelListItem = ({
  item,
  rawLabels,
  index,
}: LabelListItemProps) => {
  const unknown = item.normalization === "unknown";
  const empty = item.label === "";

  return (
    <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
      <div className="py-[10px] px-6 md:flex md:items-center md:justify-between space-y-1 md:space-y-0">
        <div className="text-sm font-normal break-all ens-webfont">
          {rawLabels.map((l, labelIndex) => (
            <Fragment key={labelIndex}>
              <span
                className={
                  index === labelIndex
                    ? "text-black font-semibold"
                    : "text-gray-500 grayscale"
                }
              >
                {l === "" ? "[empty]" : l}
              </span>
              {labelIndex < rawLabels.length - 1 && (
                <span className="text-gray-500">.</span>
              )}
            </Fragment>
          ))}
        </div>
        {(item.normalization === "unnormalized" ||
          item.normalization === "unknown") && (
          <div className="flex items-center space-x-2">
            <ShieldExclamationIcon
              className={cc([
                "w-4 h-4 fill-current",
                checkResultCodeTextColor(CheckResultCode.alert),
              ])}
            />
            <span
              className={cc([
                "text-sm",
                checkResultCodeTextColor(CheckResultCode.alert),
              ])}
            >
              {item.normalization === "unnormalized"
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
      <GraphemeList items={item.graphemes} />
    </div>
  );
};
