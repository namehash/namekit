"use client";

import { WritersBlockSuggestion } from "@/lib/utils";
import Skeleton from "./skeleton";

export const WritersBlockPill = ({
  suggestion,
}: {
  suggestion: WritersBlockSuggestion | null;
}) => {
  return (
    <button className="ens-webfont relative min-w-[180px] min-h-[48px] border py-1.5 px-5 mb-2 whitespace-nowrap text-sm font-medium leading-5 transition rounded-xl focus-visible:outline-black border-gray-200">
      <div className="text-gray-500 relative">
        {suggestion?.collectionName ? (
          <p className="break-all">{suggestion.collectionName}</p>
        ) : (
          <Skeleton className="mx-auto pt-1.5 w-[60%] min-w-[80px] h-3.5 mb-2 mt-0.5" />
        )}
      </div>
      <div className="text-gray-800 relative">
        {suggestion?.collectionName ? (
          <p className="inline break-all">{suggestion.suggestedName}</p>
        ) : (
          <Skeleton className="pb-1.5 w-full min-w-[140px] h-4" />
        )}
      </div>
    </button>
  );
};
