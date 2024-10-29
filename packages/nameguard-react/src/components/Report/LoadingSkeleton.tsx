import React from "react";

import { RatingIcon, RatingIconSize } from "./RatingIcon";
import { ReportFormattedDisplayName } from "./ReportFormattedDisplayName";
import { ReportChangesApplied } from "./ReportChangesApplied";
import { ParsedName } from "@namehash/ens-utils";
import { RatingLoadingIcon } from "../icons/RatingLoadingIcon";
import { DisplayedName } from "../DisplayedName/DisplayedName";

type LoadingSkeletonProps = {
  parsedName: ParsedName;
};

export const LoadingSkeleton = ({ parsedName }: LoadingSkeletonProps) => {
  const { transformations, outputName } = parsedName;

  return (
    <div className="rounded-xl border shadow-xl space-y-4 md:space-y-0 border-gray-200 shadow-gray-50">
      <div className="p-5 md:py-7 md:px-10 flex flex-col md:flex-row md:items-start justify-between">
        <div className="md:w-4/6">
          <p className="uppercase text-[12px] text-gray-500 font-medium">
            Rating for
          </p>
          {outputName ? (
            <>
              <h1>
                <DisplayedName
                  textStylingClasses="pt-1 text-2xl md:text-4xl text-black font-semibold md:font-bold whitespace-nowrap"
                  name={parsedName.outputName}
                  maxDisplayWidth={600}
                  displayRawName={true}
                />
              </h1>
              <ReportFormattedDisplayName name={outputName} />
            </>
          ) : (
            <div className="mt-5 w-40 h-3 rounded bg-gradient-to-r from-gray-300 to-gray-100 animate-pulse"></div>
          )}
        </div>
        <div className="flex items-start space-x-4 pt-5 md:pt-0 md:w-2/6">
          <RatingLoadingIcon size={RatingIconSize.large} />
          <div className="space-y-1 flex-shrink-0">
            <p className="font-semibold text-sm md:text-2xl text-gray-500">
              Inspecting...
            </p>
            <p className="text-gray-500 text-sm font-normal leading-6">
              Analyzing name details
            </p>
          </div>
        </div>
      </div>
      <ReportChangesApplied transformations={transformations} />
    </div>
  );
};
