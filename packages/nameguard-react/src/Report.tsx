import React from "react";
import { Summary, Check } from ".";
import { type NameGuardReport } from "@namehash/nameguard";
import { CheckResultCard } from "./CheckResultCard";
import { GraphemeCard } from "./GraphemeCard";
import { ReportFooter } from "./ReportFooter";

export const Report = ({ data }: { data: NameGuardReport }) => {
  const { name, rating, risk_count, checks, labels, title, subtitle } = data;

  const rawLabels = labels.map((label) => label.label);

  return (
    <>
      <div className="space-y-2">
        <h2 className="text-black text-2xl font-semibold">NameGuard Report</h2>
        <p className="text-gray-500 text-sm leading-6 font-normal">
          NameGuard protects you from hidden risks or limitations that an ENS
          name might contain.
        </p>
      </div>

      <Summary name={name} rating={rating} title={title} subtitle={subtitle} />

      <div className="space-y-4 md:space-y-5">
        <p className="text-black font-semibold text-lg leading-6">
          {risk_count} of {checks.length} risks found
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {checks.map((check) => (
            <CheckResultCard {...check} />
          ))}
        </div>
      </div>

      <div className="space-y-4 md:space-y-5">
        <p className="text-black font-semibold text-lg leading-6">
          Name inspection
        </p>

        {labels.map((label, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-md divide-y divide-gray-200"
          >
            <div className="py-[10px] px-6 text-sm font-normal">
              {rawLabels.map((l, index) => (
                <>
                  <span
                    key={index}
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
                </>
              ))}
            </div>
            {label?.graphemes?.map((grapheme) => (
              <GraphemeCard {...grapheme} />
            ))}
          </div>
        ))}
      </div>

      <ReportFooter />
    </>
  );
};
