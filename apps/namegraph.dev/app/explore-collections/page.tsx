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

const SUGGESTION_CATEGORY_CLASSNAME = "suggestionCategory";

export default function ExploreCollectionsPage() {
  const [nameIdeas, setNameIdeas] =
    useState<null | NameGraphGroupedByCategoryResponse>(null);
  const [nameIdeasLoading, setNameIdeasLoading] = useState(true);

  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    if (debouncedValue) {
      getCollectionsForQuery(debouncedValue)
        .then((res) => setNameIdeas(res))
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
    if (activeCategoryID) {
      clearActiveQuickJumpPills();

      const collectionPill = document.querySelector(
        '[data-collection-pill="' + activeCategoryID + '"]',
      );
      collectionPill?.classList.add(ACTIVE_QUICK_JUMP_PILL_CLASSNAME);
    }
  }, [activeCategoryID]);

  useEffect(() => {
    const elm = document.getElementById("scrollable-elm");

    console.log(elm);

    elm?.addEventListener("scroll", () => {
      console.log(elm.scrollTop);
    });

    return elm?.removeEventListener("scroll", () => {
      console.log(elm.scrollTop);
    });
  }, []);

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
            <DebounceInput
              id="query"
              type="text"
              name="query"
              autoComplete="off"
              debounceTimeout={300}
              onChange={(e) => setDebouncedValue(e.target.value)}
              className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 px-4"
            />
            <p className="leading-6 text-sm font-semibold text-gray-600 max-w-[760px] mx-auto text-center mt-6">
              Use NameGraph SDK to generate multiple name ideas suggestions for
              a single search. This works just as typing something like{" "}
              {"'Batman'"} and getting back multiple name suggestions for
              different categories related to Batman just as{" "}
              {"'Batman Creators'"}, {"'Animated Batman Films'"},{" "}
              {"'Batman Supporting Characters'"} and much more!
            </p>
          </div>
          <div className="mx-auto py-12 text-center">
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
                        ${!nameIdeasLoading ? "sticky top-16 left-0 z-20" : ""}
                      `}
                    >
                      <QuickJumpsByCategory
                        nameIdeas={nameIdeas}
                        activeCategoryID={activeCategoryID}
                      />
                    </div>
                  </>
                ) : null}
                <div className="pb-5">
                  <div
                    id="scrollable-elm"
                    className="relative z-10 transition mb-6 max-h-[600px] overflow-auto bg-gray-100 shadow"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
