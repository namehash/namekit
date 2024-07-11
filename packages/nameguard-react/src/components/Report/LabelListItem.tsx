import cc from "classcat";
import React, { Fragment } from "react";
import { GraphemeList } from "./GraphemeList";
import { NoGraphemesWarning } from "./NoGraphemesWarning";
import { CheckResultCode, NameGuardReport, Rating } from "@namehash/nameguard";
import { checkResultCodeTextColor } from "../../utils/text";
import { RatingIcon } from "./RatingIcon";

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
    <div className="ng-border ng-border-gray-200 ng-rounded-md ng-divide-y ng-divide-gray-200">
      <div className="ng-py-[10px] ng-px-6 md:ng-flex md:ng-items-center md:ng-justify-between ng-space-y-1 md:ng-space-y-0">
        <div className="ng-text-sm ng-font-normal ng-break-all ng-ens-webfont">
          {rawLabels.map((l, labelIndex) => (
            <Fragment key={labelIndex}>
              <span
                className={
                  index === labelIndex
                    ? "ng-text-black ng-font-semibold"
                    : "ng-text-gray-500 ng-grayscale"
                }
              >
                {l === "" ? "[empty]" : l}
              </span>
              {labelIndex < rawLabels.length - 1 && (
                <span className="ng-text-gray-500">.</span>
              )}
            </Fragment>
          ))}
        </div>
        {(item.normalization === "unnormalized" ||
          item.normalization === "unknown") && (
          <div className="ng-flex ng-items-center ng-space-x-2">
            <RatingIcon rating={Rating.alert} />
            <span
              className={cc([
                "ng-text-sm",
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
