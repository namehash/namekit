"use client";

import {
  generateNamesByQuery,
  NameGraphSuggestionsByCategory,
} from "@/lib/utils";
import { debounce } from "lodash";
import { NameGraphSuggestion } from "@namehash/namegraph-sdk/utils";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [nameIdeas, setNameIdeas] =
    useState<null | NameGraphSuggestionsByCategory>(null);
  const [nameIdeasLoading, setNameIdeasLoading] = useState(true);
  const [nameIdeasError, setNameIdeasError] = useState(false);
  const [suggestions, setSuggestions] = useState<null | NameGraphSuggestion[]>(
    null,
  );

  const [immediateValue, setImmediateValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  // Create a debounced function that will update the debouncedValue
  const debouncedCallback = useCallback(
    debounce((value) => {
      setDebouncedValue(value);
    }, 300),
    [], // Empty dependency array since we don't want to recreate the debounced function
  );

  const handleInputChange = (str: string) => {
    setImmediateValue(str); // Update the immediate value for responsive UI
    debouncedCallback(str); // Trigger the debounced query
  };

  useEffect(() => {
    if (debouncedValue) {
      generateNamesByQuery({ label: debouncedValue, mode: "full" })
        .then((res) => res.json())
        .then((res) => setNameIdeas(res))
        .catch((err) => setNameIdeasError(true))
        .finally(() => setNameIdeasLoading(false));
    } else {
      setNameIdeasLoading(false);
      setNameIdeasError(false);
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (nameIdeas) {
      let sugs: NameGraphSuggestion[] = [];

      nameIdeas.categories.forEach((category) => {
        sugs = {
          ...sugs,
          ...category.suggestions,
        };
      });

      setSuggestions(suggestions);
    }
  }, [nameIdeas]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold m-4 text-center">
            Collections
          </h1>
          <input
            type="text"
            name="query"
            id="query"
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 px-4"
          />
          <div className="max-w-3xl mx-auto px-4 py-12 text-center">
            <div className="w-full">
              <div className="px-5 md:px-10 lg:px-[60px]">
                <div className="text-[18px] font-semibold">
                  {suggestions?.toString()}
                  {suggestions === null || nameIdeasLoading ? (
                    <h3>Generating name ideas</h3>
                  ) : suggestions.length > 0 ? (
                    <h3>
                      {suggestions.length} name{" "}
                      {suggestions.length > 1 ? "ideas" : "idea"}
                    </h3>
                  ) : (
                    <h3>No name ideas</h3>
                  )}
                </div>
              </div>
              <div className="relative space-y-6">
                {/*
                    NameIdeas component uses two states for loading
                    state management: reqLoading and allSuggestionsLoading.

                    reqLoading is used to manage the loading state of the
                    entire NameIdeas component, while allSuggestionsLoading
                    is used to manage the loading state of the QuickJumpsByCategory.

                    QuickJumpsByCategory loading directly affects reqLoading state.
                    It needs to be displayed as soon as we have the categories
                    available, so we can calculate the need of navigation arrows
                    displaying. This is why we use allSuggestionsLoading state
                    to manage the loading state of QuickJumpsByCategory.

                    Once QuickJumpsByCategory is ready (which means, once it
                    knows the suggestedCategories and it knows wether to
                    show navigation arrows or not) we update reqLoading,
                    syncing the loading state of the entire NameIdeas.
                */}
                {nameIdeasLoading || nameIdeas ? (
                  <>
                    <div
                      className={`
                        h-8
                        ${!nameIdeasLoading ? "sticky top-0 left-0 z-20" : ""}
                      `}
                    >
                      {/* <QuickJumpsByCategory
                        activeCategoryID={activeCategoryID}
                        onLoadedQuickJumpCategories={
                          updateLoadingStateAfterQuickJumpPillsAreReady
                        }
                      /> */}
                    </div>
                  </>
                ) : null}
                <div className="pb-5">
                  {nameIdeasLoading ? (
                    <div className="w-full px-5 -mt-1 md:px-10 lg:px-[60px] pt-4">
                      {/* <SuggestionCategoriesSkeleton
                        config={config}
                        numberOfCategories={CATEGORY_SKELETONS_NUMBER}
                      /> */}
                    </div>
                  ) : nameIdeasError ? (
                    <div className="w-full mx-auto my-20 px-5 md:px-10 lg:px-[60px]">
                      {/* <DisplayedError
                        icon={errorIcon}
                        domainName={null}
                        errorCode={reqError}
                        onCallbackCtaClick={() => {
                          setNameIdeas(null);
                          setReqLoading(true);
                          setReqError(null);

                          setTimeout(() => {
                            refetchNameIdeas(primaryQueryLabel);
                          }, DEFAULT_TIMEOUT_MS_ON_QUERY_RETRY);
                        }}
                      /> */}
                    </div>
                  ) : nameIdeas?.categories ? (
                    <></>
                  ) : // <div className="relative z-10 transition pb-6">
                  //   {nameIdeas.categories.map((category, idx) => {
                  //     return (
                  //       <div
                  //         id={getCategoryID(category)}
                  //         key={`${idx}-${window.innerWidth}`}
                  //         className={cc([
                  //           SUGGESTION_CATEGORY_CLASSNAME,
                  //           "-mb-4 pt-12",
                  //           {
                  //             "-mt-12": idx === 0,
                  //           },
                  //         ])}
                  //       >
                  //         {category.type === NKNameSuggestionType.teaser &&
                  //         !authenticatedUserAddress ? (
                  //           <SuggestionCategoryTeaser
                  //             config={config}
                  //             category={category}
                  //           />
                  //         ) : (
                  //           <SuggestionCategory
                  //             config={config}
                  //             category={category}
                  //           />
                  //         )}
                  //       </div>
                  //     );
                  //   })}
                  // </div>
                  null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
