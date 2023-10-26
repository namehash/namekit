import React, { Fragment } from "react";
import cc from "classcat";
import type { NameGuardReport, Rating } from "@namehash/nameguard";

import { CheckResultCard } from "./CheckResultCard";
import { GraphemeCard } from "./GraphemeCard";
import { ReportFooter } from "./ReportFooter";
import { Shield } from "./Shield";

function borderColor(rating: Rating) {
  switch (rating) {
    case "alert": {
      return "border-red-200";
    }
    case "pass": {
      return "border-green-200";
    }
    case "warn": {
      return "border-yellow-200";
    }
    default: {
      return "border-gray-200";
    }
  }
}

function shadowColor(rating: Rating) {
  switch (rating) {
    case "alert": {
      return "shadow-red-50";
    }
    case "pass": {
      return "shadow-green-50";
    }
    case "warn": {
      return "shadow-yellow-50";
    }
    default: {
      return "shadow-gray-50";
    }
  }
}

function textColor(rating: Rating) {
  switch (rating) {
    case "alert": {
      return "text-red-700";
    }
    case "pass": {
      return "text-green-700";
    }
    case "warn": {
      return "text-yellow-700";
    }
    default: {
      return "text-gray-500";
    }
  }
}

export const Report = ({
  data,
  name,
}: {
  data: NameGuardReport;
  name: any;
}) => {
  const { rating, risk_count, checks, labels, title, subtitle } = data;

  const rawLabels = labels.map((label) => label.label);

  const border = borderColor(rating);
  const shadow = shadowColor(rating);
  const text = cc(["font-semibold text-sm md:text-2xl", textColor(rating)]);

  const wrapperClass = cc([
    "rounded-xl border shadow-xl divide-y divide-gray-200 space-y-4 md:space-y-0",
    border,
    shadow,
  ]);

  const displayNameDifferent = name.name !== name.displayName;

  return (
    <>
      <div className="space-y-2">
        <h2 className="text-black text-2xl font-semibold">NameGuard Report</h2>
        <p className="text-gray-500 text-sm leading-6 font-normal">
          NameGuard protects you from hidden risks or limitations that an ENS
          name might contain.
        </p>
      </div>

      <div className={wrapperClass}>
        <div className="p-5 md:py-7 md:px-10 flex flex-col md:flex-row md:items-start justify-between">
          <div className="md:w-4/6">
            <p className="uppercase text-[12px] text-gray-500 font-medium">
              Rating for
            </p>
            <h1 className="mt-1 text-2xl md:text-4xl text-black font-semibold md:font-bold">
              {name.displayName}
            </h1>
            {displayNameDifferent && (
              <p className="text-sm text-gray-500 mt-4">
                <span className="mr-2.5">Generally displays as:</span>
                <span className="text-black">{name.displayName}</span>
              </p>
            )}
          </div>
          <div className="flex items-start space-x-4 pt-5 md:pt-0 md:w-2/6">
            <Shield status={rating} size="large" />
            <div className="space-y-1">
              <p className={text}>{title}</p>
              <p className="text-black text-sm font-normal leading-6">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full px-5 md:px-10 py-4 md:py-3">
          <p className="text-sm text-gray-500">
            <span className="mr-2.5">Changes applied to your search:</span>
          </p>
        </div>
      </div>

      <div className="space-y-4 md:space-y-5">
        <p className="text-black font-semibold text-lg leading-6">
          {risk_count} of {checks.length} risks found
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {checks.map((check, index) => (
            <CheckResultCard key={index} {...check} />
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
    </>
  );
};
