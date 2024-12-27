"use client";

import { WritersBlockSuggestion } from "@namehash/namegraph-sdk/utils";

export const WritersBlockPill = ({
  suggestion,
}: {
  suggestion: WritersBlockSuggestion;
}) => {
  return (
    <div className="ens-webfont relative min-w-[180px] min-h-[48px] bg-white border py-1.5 px-5 mb-2 whitespace-nowrap text-sm font-medium leading-5 transition rounded-xl focus-visible:outline-black border-gray-200">
      <div className="text-gray-500 relative">
        <p className="break-all">{suggestion.collectionName}</p>
      </div>
      <div className="text-gray-800 relative">
        <p className="inline break-all">{suggestion.suggestedName}</p>
      </div>
    </div>
  );
};
