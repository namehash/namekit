import React from "react";

import { RatingIconSize } from "./RatingIcon";
import { ReportFormattedDisplayName } from "./ReportFormattedDisplayName";
import { RatingLoadingIcon } from "../icons/RatingLoadingIcon";
import { ReportChangesApplied } from "./ReportChangesApplied";
import { DisplayedName } from "@namehash/namekit-react";
import { ParsedName } from "@namehash/ens-utils";

type LoadingSkeletonProps = {
  parsedName: ParsedName;
};

export const LoadingSkeleton = ({ parsedName }: LoadingSkeletonProps) => {
  const { transformations, outputName } = parsedName;

  return (
    <div className="ng-rounded-xl ng-border ng-shadow-xl ng-space-y-4 md:ng-space-y-0 ng-border-gray-200 ng-shadow-gray-50">
      <div className="ng-p-5 md:ng-py-7 md:ng-px-10 ng-flex ng-flex-col md:ng-flex-row md:ng-items-start ng-justify-between">
        <div className="md:ng-w-4/6">
          <p className="ng-uppercase ng-text-sm ng-text-gray-500 ng-font-medium">
            Rating for
          </p>
          {outputName ? (
            <>
              <h1>
                <DisplayedName
                  textStylingClasses="ng-pt-1 ng-text-2xl md:ng-text-4xl ng-text-black ng-font-semibold md:ng-font-bold ng-whitespace-nowrap"
                  name={parsedName.outputName}
                  maxDisplayWidth={600}
                  displayRawName={true}
                />
              </h1>
              <ReportFormattedDisplayName name={outputName} />
            </>
          ) : (
            <div className="ng-mt-5 ng-w-40 ng-h-3 ng-rounded ng-bg-gradient-to-r ng-from-gray-300 ng-to-gray-100 ng-animate-pulse"></div>
          )}
        </div>
        <div className="ng-flex ng-items-start ng-space-x-4 ng-pt-5 md:ng-pt-0 md:ng-w-2/6">
          <RatingLoadingIcon size={RatingIconSize.large} />
          <div className="ng-space-y-1 ng-flex-shrink-0">
            <p className="ng-font-semibold ng-text-sm md:ng-text-2xl ng-text-gray-500">
              Inspecting...
            </p>
            <p className="ng-text-gray-500 ng-text-sm ng-font-normal ng-leading-6">
              Analyzing name details
            </p>
          </div>
        </div>
      </div>
      <ReportChangesApplied transformations={transformations} />
    </div>
  );
};
