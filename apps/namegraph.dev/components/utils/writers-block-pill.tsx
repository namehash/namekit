"use client";

import { getNameDetailsPageHref } from "@/lib/utils";
import { WritersBlockSuggestion } from "@namehash/namegraph-sdk/utils";
import { Link } from "@namehash/namekit-react";
import { useRouter } from "next/navigation";
import { NameWithCurrentTld, useQueryParams } from "../use-query-params";
import { TruncatedText } from "@namehash/namekit-react/client";

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
        router.push(`/collections/${suggestion.collectionId}`);
      }}
      className="truncate hover:cursor-pointer w-full md:w-auto flex flex-col items-center justify-center hover:bg-gray-100 hover:transition ens-webfont relative min-w-[180px] min-h-[48px] bg-white border py-1.5 px-5 whitespace-nowrap text-sm font-medium leading-5 transition rounded-xl focus-visible:outline-black border-gray-200"
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
        <TruncatedText
          maxDisplayWidth={300}
          text={NameWithCurrentTld({ name: suggestion.suggestedName, params })}
        />
      </Link>
    </a>
  );
};
