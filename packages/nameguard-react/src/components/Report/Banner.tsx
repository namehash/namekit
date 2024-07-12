import React from "react";
import cc from "classcat";
import { type NameGuardReport } from "@namehash/nameguard";
import { type ParsedName } from "@namehash/ens-utils";

import { RatingIcon, RatingIconSize } from "./RatingIcon";
import { RatedBox } from "../RatedBox/RatedBox";
import { ReportChangesApplied } from "./ReportChangesApplied";
import { ReportFormattedDisplayName } from "./ReportFormattedDisplayName";
import { DisplayedName } from "@namehash/namekit-react";
import { ratingTextColor } from "../../utils/text";

type Props = {
  report?: NameGuardReport;
  parsedName?: ParsedName;
};

export function Banner({ report, parsedName }: Props) {
  const { title, subtitle, rating } = report;

  const text = cc([
    "ng-font-semibold ng-text-sm ng-md:text-2xl",
    ratingTextColor(rating),
  ]);

  return (
    <RatedBox rating={rating}>
      <div className="ng-p-5 md:ng-py-7 md:ng-px-10 ng-flex ng-flex-col md:ng-flex-row md:ng-items-start ng-justify-between">
        <div className="md:ng-w-4/6 ng-overflow-hidden ng-overflow-ellipsis">
          <p className="ng-uppercase ng-text-sm ng-text-gray-500 ng-font-medium">
            Rating for
          </p>
          <h1>
            <DisplayedName
              textStylingClasses="ng-pt-1 ng-text-2xl md:ng-text-4xl ng-text-black ng-font-semibold md:ng-font-bold ng-whitespace-nowrap"
              name={parsedName.outputName}
              maxDisplayWidth={600}
              displayRawName={true}
            />
          </h1>
          <ReportFormattedDisplayName name={parsedName.outputName} />
        </div>
        <div className="ng-flex ng-items-start ng-space-x-4 ng-pt-5 md:ng-pt-0 md:ng-w-2/6 ng-flex-shrink-0">
          <div className="ng-flex-shrink-0">
            <RatingIcon rating={rating} size={RatingIconSize.large} />
          </div>
          <div className="ng-space-y-1 ng-flex-shrink-0">
            <p className={cc([text, ratingTextColor(rating)])}>{title}</p>
            <p className="ng-text-black ng-text-sm ng-font-normal ng-leading-6 ng-break-all">
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
