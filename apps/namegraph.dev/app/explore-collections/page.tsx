"use client";

import {
  getCategoryID,
  QuickJumpsByCategory,
} from "@/components/mini-apps/explore-collections/quick-jumps-by-category";
import { SuggestionCategory } from "@/components/mini-apps/explore-collections/suggestion-category";
import {
  NameGraphFetchTopCollectionMembersResponse,
  NameGraphGroupedByCategoryResponse,
} from "@namehash/namegraph-sdk/utils";
import { getCollectionsForQuery } from "@/lib/utils";
import { DebounceInput } from "react-debounce-input";
import { useEffect, useState } from "react";
import lodash from "lodash";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/solid";

const SUGGESTION_CATEGORY_CLASSNAME = "suggestionCategory";

export default function ExploreCollectionsPage() {
  /**
   * nameIdeas state:
   *
   * undefined is set when component never tried querying name ideas
   * null is set when component tried querying name ideas but failed
   * NameGraphGroupedByCategoryResponse is set when name ideas were successfully queried
   */
  const [nameIdeas, setNameIdeas] = useState<
    undefined | null | NameGraphGroupedByCategoryResponse
  >(undefined);

  const [nameIdeasLoading, setNameIdeasLoading] = useState(true);

  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    if (debouncedValue) {
      let query = debouncedValue;
      if (debouncedValue.includes(".")) {
        query = debouncedValue.split(".")[0];
      }

      setNameIdeas(undefined);
      setNameIdeasLoading(true);
      getCollectionsForQuery(query)
        .then((res) => setNameIdeas(res))
        .catch(() => setNameIdeas(null))
        .finally(() => setNameIdeasLoading(false));
    } else {
      setNameIdeasLoading(false);
    }
  }, [debouncedValue]);

  const [activeCategoryID, setActiveCategoryID] = useState("");

  useEffect(() => {
    if (nameIdeas?.categories.length && !activeCategoryID) {
      setActiveCategoryID(getCategoryID(nameIdeas.categories[0]));
    }
  }, [nameIdeas?.categories]);

  const setFirstQuickJumpPillAsActive = () => {
    const firstCollectionPill = document.querySelector(".collectionPill");
    const categoryID = firstCollectionPill?.getAttribute(
      "data-navigation-item",
    );

    if (categoryID) {
      setActiveCategoryID(categoryID);
    }
  };

  const setActiveQuickJumpPill = () => {
    const scrollableContainer = document.getElementById("scrollable-elm");

    if (scrollableContainer) {
      console.log(scrollableContainer.getBoundingClientRect());

      // if the container was not yet scrolled
      if (
        scrollableContainer.scrollTop <
          scrollableContainer?.getBoundingClientRect().y ||
        !scrollableContainer.scrollTop
      ) {
        setFirstQuickJumpPillAsActive();
        return;
      }

      const containerScrollTopPosition =
        scrollableContainer?.getBoundingClientRect().top +
        scrollableContainer?.scrollTop;
      const containerScrollBottomPosition =
        scrollableContainer?.getBoundingClientRect().bottom +
        scrollableContainer?.scrollTop;

      const categories = document.querySelectorAll(
        `.${SUGGESTION_CATEGORY_CLASSNAME}`,
      );

      categories.forEach((category, idx) => {
        if (idx === 0) {
          const firstCategoryBottom = category.getAttribute(
            "data-category-bottom",
          );
          const secondCategoryTop =
            categories[idx + 1].getAttribute("data-category-top");

          if (
            containerScrollTopPosition <= Number(firstCategoryBottom) ||
            containerScrollBottomPosition < Number(secondCategoryTop)
          ) {
            setActiveCategoryID(category.id);
          }
        } else {
          const currentCategoryTop = category.getAttribute("data-category-top");
          const currentCategoryBottom = category.getAttribute(
            "data-category-bottom",
          );

          if (
            containerScrollTopPosition <= Number(currentCategoryBottom) &&
            containerScrollTopPosition >= Number(currentCategoryTop)
          ) {
            setActiveCategoryID(category.id);
          }
        }
      });

      // if the container was scrolled to its bottom
      if (
        scrollableContainer.scrollHeight &&
        scrollableContainer.scrollTop &&
        scrollableContainer.clientHeight + scrollableContainer.scrollTop >=
          scrollableContainer.scrollHeight
      ) {
        const lastCategory = categories[categories.length - 1];

        if (lastCategory) {
          setActiveCategoryID(lastCategory.id);
        }
      }
    }
  };
  const ACTIVE_QUICK_JUMP_PILL_CLASSNAME = "activeQuickJumpPill";
  const clearActiveQuickJumpPills = () => {
    const activeCollectionPills = document.querySelectorAll(
      `.${ACTIVE_QUICK_JUMP_PILL_CLASSNAME}`,
    );
    activeCollectionPills.forEach((pill) => {
      pill.classList.remove(ACTIVE_QUICK_JUMP_PILL_CLASSNAME);
    });
  };

  useEffect(() => {
    const wrapper = document.getElementById("scrollable-elm");

    if (wrapper) {
      wrapper.addEventListener(
        "scroll",
        lodash.debounce(setActiveQuickJumpPill, 100),
      );
      wrapper.addEventListener(
        "resize",
        lodash.debounce(setActiveQuickJumpPill, 100),
      );
    }

    return () => {
      if (wrapper) {
        wrapper.removeEventListener(
          "scroll",
          lodash.debounce(setActiveQuickJumpPill, 100),
        );
        wrapper.removeEventListener(
          "resize",
          lodash.debounce(setActiveQuickJumpPill, 100),
        );
      }
    };
  }, []);

  useEffect(() => {
    if (nameIdeas) {
      setActiveQuickJumpPill();
    }
  }, [nameIdeas]);

  useEffect(() => {
    if (activeCategoryID) {
      clearActiveQuickJumpPills();

      const collectionPill = document.querySelector(
        '[data-collection-pill="' + activeCategoryID + '"]',
      );
      collectionPill?.classList.add(ACTIVE_QUICK_JUMP_PILL_CLASSNAME);
    }
  }, [activeCategoryID]);

  return (
    <div className="mx-auto py-8 w-full">
      <div className="flex flex-col gap-8">
        <div className="flex-1">
          <div className="container mx-auto px-6">
            <div className="px-5 md:px-10 lg:px-[60px]">
              <h1 className="text-xl font-semibold text-center w-full mb-6">
                🔎 Search for a name and see name ideas ⬇️
              </h1>
            </div>
            <div className="flex space-x-2 items-center">
              <DebounceInput
                id="query"
                type="text"
                name="query"
                autoComplete="off"
                debounceTimeout={300}
                onChange={(e) => setDebouncedValue(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 px-4"
              />
              {nameIdeasLoading ? (
                <>
                  {/* Display a Loading icon if the dApp query is being typed by the visitor */}
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 ml-1 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </>
              ) : debouncedValue ? (
                <>
                  {/* Display a Check (similar to ✅) if the dApp submitted the debouncedValue query to NameGraph SDK  */}
                  <svg
                    className="w-6 h-6 text-green-500 dark:text-green-400 flex-shrink-0"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                  </svg>
                </>
              ) : (
                <>
                  {/* Display a Magnifying glass icon if the dApp is awaiting for a query  */}
                  <MagnifyingGlassCircleIcon className="w-8 h-8 text-gray-300" />
                </>
              )}
            </div>
            <p className="leading-6 text-sm font-semibold text-gray-600 max-w-[760px] mx-auto text-center mt-6">
              Use NameGraph SDK to generate multiple name ideas suggestions for
              a single search. This works just as typing something like{" "}
              {"'Batman'"} and getting back multiple name suggestions for
              different categories related to Batman just as{" "}
              {"'Batman Creators'"}, {"'Animated Batman Films'"},{" "}
              {"'Batman Supporting Characters'"} and much more!
            </p>
          </div>
          <div className="mx-auto py-4 pb-12 text-center">
            <div className="w-full">
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
                {debouncedValue && (nameIdeasLoading || nameIdeas) ? (
                  <>
                    <div
                      className={`
                        h-8 mb-[72px]
                        ${!nameIdeasLoading ? "sticky top-10 left-0 z-20" : ""}
                      `}
                    >
                      <div className="bg-gradient-white-to-transparent-top-bottom transform rotate-180 w-full h-12"></div>
                      <QuickJumpsByCategory
                        search={debouncedValue}
                        nameIdeas={nameIdeas}
                        activeCategoryID={activeCategoryID}
                      />
                      <div className="bg-gradient-white-to-transparent-top-bottom w-full h-12"></div>
                    </div>
                  </>
                ) : null}
                {debouncedValue && (
                  <div className="pb-5">
                    <div
                      id="scrollable-elm"
                      className="relative z-10 transition max-h-[600px] py-20 overflow-auto bg-white"
                    >
                      {nameIdeas
                        ? nameIdeas.categories.map(
                            (
                              category: NameGraphFetchTopCollectionMembersResponse,
                              idx: number,
                            ) => {
                              return (
                                <div
                                  id={getCategoryID(category)}
                                  key={`${idx}-${window.innerWidth}`}
                                  className={`
                              ${SUGGESTION_CATEGORY_CLASSNAME}
                              -mb-4 pt-12 
                              ${idx === 0 ? "-mt-12" : ""}`}
                                >
                                  <SuggestionCategory category={category} />
                                </div>
                              );
                            },
                          )
                        : null}
                    </div>
                    <div className="bg-gradient-white-to-transparent-top-bottom w-full h-12"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
