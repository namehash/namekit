import React, { Fragment } from "react";

import { Banner, CheckResultCard, GraphemeCard, ReportFooter } from ".";
import type { NameGuardReport } from "@namehash/nameguard";
import { ShieldExclamationIcon } from "@heroicons/react/20/solid";
import { UnknownGraphemeCard } from "./UnknownGraphemeCard";

type Props = {
  parseNameResponse: unknown;
  data: NameGuardReport;
};

export const Report = (props: Props) => {
  const { parseNameResponse, data } = props;

  const rawLabels = data?.labels.map((label) => label.label) ?? [];

  if (!parseNameResponse || !data) return null;

  return (
    <Fragment>
      <Banner parsedName={parseNameResponse} report={data} />
      <div className="space-y-4 md:space-y-5">
        <p className="text-black font-semibold text-lg leading-6">
          {data?.risk_count} of {data?.checks.length} risks found
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {data?.checks.map((check, index) => (
            <CheckResultCard key={index} {...check} />
          ))}
        </div>
      </div>
      <div className="space-y-4 md:space-y-5">
        <p className="text-black font-semibold text-lg leading-6">
          Name inspection
        </p>

        {data?.labels.map((label, index) => (
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
                      {l}
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
            {label?.normalization === "unknown" && (
              <UnknownGraphemeCard
                title="Unknown label"
                description="This part of the name was registered in a way that makes it unknown."
              />
            )}
            {label?.graphemes?.length === 0 && (
              <UnknownGraphemeCard
                title="Empty label"
                description="This part of the name is empty."
              />
            )}
            {label?.graphemes?.map((grapheme, index) => (
              <GraphemeCard key={index} {...grapheme} />
            ))}
          </div>
        ))}
      </div>
      <ReportFooter />
    </Fragment>
  );
};
