import React from "react";

type Props = {
  transformations?: any[];
};

const transformationText = {
  ens_normalize: "ENS Normalization",
  trim_whitespace: "Trimmed whitespace",
  assume_tld: `Added ".eth"`,
};

export function ChangesApplied({ transformations = [] }: Props) {
  if (transformations.length === 0) return null;

  return (
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
  );
}
