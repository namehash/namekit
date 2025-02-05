"use client";

import { useEffect, useState } from "react";
import { WritersBlockPills } from "@/components/mini-apps/ideate/writers-block-pills";
import { writersBlockSuggestions } from "@/lib/writers-block-suggestions";
import {
  sampleWritersBlockSuggestions,
  WritersBlockCollection,
  WritersBlockSuggestion,
} from "@namehash/namegraph-sdk/utils";
import { HeroStartCommand } from "@/components/hero-start-command";
import { RedirectSearchBar } from "@/components/redirect-search-bar";

export default function HomePage() {
  const [suggestions, setSuggestions] = useState<WritersBlockSuggestion[]>([]);

  const ideate = (catalog: WritersBlockCollection[]) => {
    const wbSuggestions = sampleWritersBlockSuggestions(5, catalog);
    setSuggestions(wbSuggestions);
  };

  useEffect(() => {
    ideate(writersBlockSuggestions);
  }, []);

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-4xl flex flex-col mx-auto text-center">
        <div className="flex flex-col gap-2 w-full h-fit mb-4">
          <p className="text-center not-italic uppercase text-gray-500 text-xs tracking-[0.3px] font-medium">
            FULLY OPEN SOURCE
          </p>
          <h1 className="text-black text-center not-italic font-bold text-4xl leading-10 sm:text-5xl sm:leading-[52px]">
            NameGraph Developer Demo
          </h1>
        </div>
        <p className="text-center not-italic font-normal text-gray-500 text-lg leading-7 sm:text-base sm:leading-6 sm:font-light">
          Help your users discover ENS names they love with NameGraph.
        </p>
        <p className="text-center not-italic font-normal text-gray-500 text-lg leading-7 sm:text-base sm:leading-6 sm:font-light">
          NameGraph empowers ENS registrar apps to build new name discovery user
          experiences. Surf more than 21 million name ideas across more than
          400,000 name collections, or generate infinite related name
          suggestions.
        </p>
        <div className="flex mx-auto mt-6">
          <HeroStartCommand />
        </div>

        <RedirectSearchBar withSubmitCta withTitle />
        <WritersBlockPills suggestions={suggestions}></WritersBlockPills>
      </div>
    </div>
  );
}
