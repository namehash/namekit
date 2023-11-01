import React, { Fragment } from "react";

import { Banner, CheckResultCard, LabelList, ReportFooter } from ".";
import type { NameGuardReport } from "@namehash/nameguard";

type Props = {
  parseNameResponse: unknown;
  data: NameGuardReport;
};

export const Report = (props: Props) => {
  const { parseNameResponse, data } = props;

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

        <LabelList items={data.labels} />
      </div>
      <ReportFooter />
    </Fragment>
  );
};
