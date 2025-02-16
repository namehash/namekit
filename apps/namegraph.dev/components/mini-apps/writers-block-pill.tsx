"use client";

import { getNameDetailsPageHref } from "@/lib/utils";
import { WritersBlockSuggestion } from "@namehash/namegraph-sdk/utils";
import { Link } from "@namehash/namekit-react";
import { useRouter } from "next/navigation";
import { NameWithCurrentTld, useQueryParams } from "../use-query-params";

export const WritersBlockPill = ({
  suggestion,
}: {
  suggestion: WritersBlockSuggestion;
}) => {
  const { params } = useQueryParams();
  const router = useRouter();

  return (
    <a
      onClick={(e) => {
        e.preventDefault();
        router.push(`/${suggestion.collectionId}`);
      }}
      className="hover:cursor-pointer hover:bg-gray-100 hover:transition ens-webfont relative min-w-[180px] min-h-[48px] bg-white border py-1.5 px-5 mb-2 whitespace-nowrap text-sm font-medium leading-5 transition rounded-xl focus-visible:outline-black border-gray-200"
    >
      <div className="text-gray-500 relative">
        <p className="break-all">{suggestion.collectionName}</p>
      </div>
      <Link
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          router.push(getNameDetailsPageHref(suggestion.suggestedName));
        }}
        className="text-gray-800 relative"
      >
        <p className="inline break-all">
          {NameWithCurrentTld({ name: suggestion.suggestedName, params })}
        </p>
      </Link>
    </a>
  );
};
