import React from "react";
import cc from "classcat";
import { type NameGuardReport } from "@namehash/nameguard";
import type { ParsedName } from "@namehash/ens-utils";

import { RatingIcon, RatingIconSize } from "./RatingIcon";
import { RatedBox } from "../RatedBox/RatedBox";
import { ReportChangesApplied } from "./ReportChangesApplied";
import { ReportFormattedDisplayName } from "./ReportFormattedDisplayName";
import { ratingTextColor } from "../../utils/text";
import { DisplayedName } from "../DisplayedName/DisplayedName";

type Props = {
  report?: NameGuardReport;
  parsedName?: ParsedName;
};

export function Banner({ report, parsedName }: Props) {
  const { title, subtitle, rating } = report;

  const text = cc([
    "font-semibold text-sm md:text-2xl",
    ratingTextColor(rating),
  ]);

  return (
    <RatedBox rating={rating}>
      <div className="p-5 md:py-7 md:px-10 flex flex-col md:flex-row md:items-start justify-between">
        <div className="md:w-4/6 overflow-hidden overflow-ellipsis">
          <p className="uppercase text-[12px] text-gray-500 font-medium">
            Rating for
          </p>
          <h1>
            <DisplayedName
              textStylingClasses="pt-1 text-2xl md:text-4xl text-black font-semibold md:font-bold whitespace-nowrap"
              name={parsedName.outputName}
              maxDisplayWidth={600}
              displayRawName={true}
            />
          </h1>
          <ReportFormattedDisplayName name={parsedName.outputName} />
        </div>
        <div className="flex items-start space-x-4 pt-5 md:pt-0 md:w-2/6 flex-shrink-0">
          <div className="flex-shrink-0">
            <RatingIcon rating={rating} size={RatingIconSize.large} />
          </div>
          <div className="space-y-1 flex-shrink-0">
            <p className={cc([text, ratingTextColor(rating)])}>{title}</p>
            <p className="text-black text-sm font-normal leading-6 break-all">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
      {parsedName?.transformations && (
        <ReportChangesApplied transformations={parsedName.transformations} />
      )}
    </RatedBox>
  );
}
