import React from "react";
import cc from "classcat";
import type { NameGuardReport, Rating } from "@namehash/nameguard";

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
      return "text-yellow-600";
    }
    default: {
      return "text-gray-500";
    }
  }
}

type Props = {
  report?: NameGuardReport;
  parsedName: any;
};

const transformationText = {
  ens_normalize: "ENS Normalization",
  trim_whitespace: "Trimmed whitespace",
  assume_tld: `Added ".eth"`,
};

export function Banner({ report, parsedName }: Props) {
  const { name, title, subtitle, rating, beautiful_name } = report;
  const { outputName, transformations } = parsedName;

  const border = borderColor(rating);
  const shadow = shadowColor(rating);
  const text = cc(["font-semibold text-sm md:text-2xl", textColor(rating)]);

  const wrapperClass = cc(["rounded-xl border shadow-xl", border, shadow]);

  const displayNameDifferent = ![
    outputName.displayName,
    beautiful_name,
  ].includes(name);
  const displayTransformations = transformations.length >= 1;

  return (
    <div className={wrapperClass}>
      <div className="p-5 md:py-7 md:px-10 flex flex-col md:flex-row md:items-start justify-between">
        <div className="md:w-4/6">
          <p className="uppercase text-[12px] text-gray-500 font-medium">
            Rating for
          </p>
          <h1 className="mt-1 text-2xl md:text-4xl text-black font-semibold md:font-bold">
            {name || outputName.displayName}
          </h1>
          {displayNameDifferent && (
            <p className="text-sm text-gray-500 mt-4">
              <span className="mr-2.5">Generally displays as:</span>
              <span className="text-black">
                {beautiful_name || outputName.displayName}
              </span>
            </p>
          )}
        </div>
        <div className="flex items-start space-x-4 pt-5 md:pt-0 md:w-2/6">
          <div className="flex-shrink-0">
            <Shield status={rating} size="large" />
          </div>
          <div className="space-y-1">
            <p className={text}>{title}</p>
            <p className="text-black text-sm font-normal leading-6">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
      {displayTransformations && (
        <div className="border-t border-gray-200 mx-6 md:mx-0">
          <div className="w-full md:px-10 py-4 md:py-3 flex items-center flex-wrap">
            <span className="text-sm text-gray-500 mr-2.5">
              Changes applied to your search:
            </span>
            <div className="space-x-1.5 flex items-center mt-2 md:mt-0">
              {transformations.map((t, i) => (
                <span
                  className="bg-gray-100 rounded-full px-3 py-0.5 text-sm font-medium text-black"
                  key={i}
                >
                  {transformationText[t]}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
