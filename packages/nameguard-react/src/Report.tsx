import React, { Fragment } from "react";

import { Banner, CheckResultCard, GraphemeCard, ReportFooter } from ".";

export const Report = (props: any) => {
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
            <div className="py-[10px] px-6 text-sm font-normal">
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
