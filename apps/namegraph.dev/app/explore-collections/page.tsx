"use client";

import {
  getCategoryID,
  QuickJumpsByCategory,
} from "@/components/mini-apps/explore-collections/quick-jumps-by-category";
import { SuggestionCategory } from "@/components/mini-apps/explore-collections/suggestion-category";
import { NameGraphGroupedByCategoryResponse } from "@namehash/namegraph-sdk/utils";
import { useEffect, useState } from "react";
import { DebounceInput } from "react-debounce-input";
import lodash from "lodash";
import { generateNamesByQuery } from "@/lib/utils";

export const SUGGESTION_CATEGORY_CLASSNAME = "suggestionCategory";

export default function Home() {
  const [nameIdeas, setNameIdeas] =
    useState<null | NameGraphGroupedByCategoryResponse>(null);
  const [nameIdeasLoading, setNameIdeasLoading] = useState(true);

  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    if (debouncedValue) {
      generateNamesByQuery({ label: debouncedValue, mode: "full" })
        .then((res) => res.json())
        .then((res) => setNameIdeas(res))
        .finally(() => setNameIdeasLoading(false));

      // Currently we are mocking name ideas as NameGraph API does not support web-client requests
      // setNameIdeas(MOCKED_NAME_IDEAS);
      setNameIdeasLoading(false);
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
                        h-8 mb-20
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
                  {nameIdeas?.categories ? (
                    <div className="relative z-10 transition pb-6">
                      {nameIdeas.categories.map(
                        (category: any, idx: number) => {
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
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const MOCKED_NAME_IDEAS: NameGraphGroupedByCategoryResponse = {
  categories: [
    {
      suggestions: [
        {
          name: "abaddon.eth",
          tokenized_label: ["abaddon"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: ["pre-punk-club"],
            cached_interesting_score: 0.9318071191531209,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Dota 2 Heroes",
            collection_id: "syaAFrpXlCZz",
            grouping_category: "related",
          },
        },
        {
          name: "alchemist.eth",
          tokenized_label: ["alchemist"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: ["pre-punk-club"],
            cached_interesting_score: 0.9340441846002543,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Dota 2 Heroes",
            collection_id: "syaAFrpXlCZz",
            grouping_category: "related",
          },
        },
        {
          name: "ancientapparition.eth",
          tokenized_label: ["ancient", "apparition"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9313773568803155,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Dota 2 Heroes",
            collection_id: "syaAFrpXlCZz",
            grouping_category: "related",
          },
        },
        {
          name: "antimage.eth",
          tokenized_label: ["anti", "mage"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9320924083733166,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Dota 2 Heroes",
            collection_id: "syaAFrpXlCZz",
            grouping_category: "related",
          },
        },
        {
          name: "arcwarden.eth",
          tokenized_label: ["arc", "warden"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9220784999999999,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Dota 2 Heroes",
            collection_id: "syaAFrpXlCZz",
            grouping_category: "related",
          },
        },
        {
          name: "axe.eth",
          tokenized_label: ["axe"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [
              "3-letters",
              "english-verbs",
              "3-letter-dictionary",
              "3-letter-first-names",
            ],
            cached_interesting_score: 0.9264070714285715,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Dota 2 Heroes",
            collection_id: "syaAFrpXlCZz",
            grouping_category: "related",
          },
        },
        {
          name: "bane.eth",
          tokenized_label: ["bane"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: ["4-letter-dictionary"],
            cached_interesting_score: 0.9338278654392909,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Dota 2 Heroes",
            collection_id: "syaAFrpXlCZz",
            grouping_category: "related",
          },
        },
        {
          name: "batrider.eth",
          tokenized_label: ["batrider"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9316442452168803,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Dota 2 Heroes",
            collection_id: "syaAFrpXlCZz",
            grouping_category: "related",
          },
        },
        {
          name: "beastmaster.eth",
          tokenized_label: ["beastmaster"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9320271701762303,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Dota 2 Heroes",
            collection_id: "syaAFrpXlCZz",
            grouping_category: "related",
          },
        },
        {
          name: "bloodseeker.eth",
          tokenized_label: ["bloodseeker"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9320009140696623,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Dota 2 Heroes",
            collection_id: "syaAFrpXlCZz",
            grouping_category: "related",
          },
        },
      ],
      name: "Dota 2 Heroes",
      type: "related",
      collection_id: "syaAFrpXlCZz",
      collection_title: "Dota 2 Heroes",
      collection_members_count: 124,
      related_collections: [],
    },
    {
      suggestions: [
        {
          name: "spiderman.eth",
          tokenized_label: ["spiderman"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9343148968081441,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Thor (Marvel Comics) enemies",
            collection_id: "xYSJ6SKBBe99",
            grouping_category: "related",
          },
        },
        {
          name: "ironman.eth",
          tokenized_label: ["iron", "man"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: ["pre-punk-club"],
            cached_interesting_score: 0.9339111574071358,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Thor (Marvel Comics) enemies",
            collection_id: "xYSJ6SKBBe99",
            grouping_category: "related",
          },
        },
        {
          name: "thanos.eth",
          tokenized_label: ["thanos"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9242427857142858,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Thor (Marvel Comics) enemies",
            collection_id: "xYSJ6SKBBe99",
            grouping_category: "related",
          },
        },
        {
          name: "hulk.eth",
          tokenized_label: ["hulk"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: ["4-letter-dictionary"],
            cached_interesting_score: 0.9342689074270695,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Thor (Marvel Comics) enemies",
            collection_id: "xYSJ6SKBBe99",
            grouping_category: "related",
          },
        },
        {
          name: "wolverine.eth",
          tokenized_label: ["wolverine"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9341296411670391,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Thor (Marvel Comics) enemies",
            collection_id: "xYSJ6SKBBe99",
            grouping_category: "related",
          },
        },
        {
          name: "doctordoom.eth",
          tokenized_label: ["doctor", "doom"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: ["pre-punk-club"],
            cached_interesting_score: 0.9318184976614495,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Thor (Marvel Comics) enemies",
            collection_id: "xYSJ6SKBBe99",
            grouping_category: "related",
          },
        },
        {
          name: "venom.eth",
          tokenized_label: ["venom"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "on_sale",
            categories: ["5-letter-dictionary", "english-nouns"],
            cached_interesting_score: 0.934217177910979,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Thor (Marvel Comics) enemies",
            collection_id: "xYSJ6SKBBe99",
            grouping_category: "related",
          },
        },
        {
          name: "galactus.eth",
          tokenized_label: ["galactus"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: ["pre-punk-club"],
            cached_interesting_score: 0.9227999285714287,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Thor (Marvel Comics) enemies",
            collection_id: "xYSJ6SKBBe99",
            grouping_category: "related",
          },
        },
        {
          name: "janefoster.eth",
          tokenized_label: ["jane", "foster"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9318584209224321,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Thor (Marvel Comics) enemies",
            collection_id: "xYSJ6SKBBe99",
            grouping_category: "related",
          },
        },
        {
          name: "titania.eth",
          tokenized_label: ["titania"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9333881108058882,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Thor (Marvel Comics) enemies",
            collection_id: "xYSJ6SKBBe99",
            grouping_category: "related",
          },
        },
      ],
      name: "Thor (Marvel Comics) enemies",
      type: "related",
      collection_id: "xYSJ6SKBBe99",
      collection_title: "Thor (Marvel Comics) enemies",
      collection_members_count: 89,
      related_collections: [
        {
          collection_id: "BmjZ5T2bWFpk",
          collection_title: "Marvel Comics characters",
          collection_members_count: 1662,
        },
        {
          collection_id: "Hb7IuozsPOiS",
          collection_title: "Brotherhood of Mutants members",
          collection_members_count: 346,
        },
        {
          collection_id: "nCyUuy6rQiAP",
          collection_title: "Marvel Comics aliens",
          collection_members_count: 84,
        },
      ],
    },
    {
      suggestions: [
        {
          name: "aaba.eth",
          tokenized_label: ["a", "aba"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9256856428571429,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Nasdaq ens index",
            collection_id: "KrlYQ_DEa4lI",
            grouping_category: "related",
          },
        },
        {
          name: "aal.eth",
          tokenized_label: ["a", "al"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "on_sale",
            categories: ["3-letters", "3-letter-dictionary"],
            cached_interesting_score: 0.9264070714285715,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Nasdaq ens index",
            collection_id: "KrlYQ_DEa4lI",
            grouping_category: "related",
          },
        },
        {
          name: "aame.eth",
          tokenized_label: ["a", "a", "me"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "available",
            categories: [],
            cached_interesting_score: 0.931622388404583,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Nasdaq ens index",
            collection_id: "KrlYQ_DEa4lI",
            grouping_category: "related",
          },
        },
        {
          name: "aaoi.eth",
          tokenized_label: ["a", "aoi"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "available",
            categories: [],
            cached_interesting_score: 0.9256856428571429,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Nasdaq ens index",
            collection_id: "KrlYQ_DEa4lI",
            grouping_category: "related",
          },
        },
        {
          name: "aaon.eth",
          tokenized_label: ["a", "a", "on"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9316950682630144,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Nasdaq ens index",
            collection_id: "KrlYQ_DEa4lI",
            grouping_category: "related",
          },
        },
        {
          name: "aapl.eth",
          tokenized_label: ["a", "apl"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9315877908521273,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Nasdaq ens index",
            collection_id: "KrlYQ_DEa4lI",
            grouping_category: "related",
          },
        },
        {
          name: "aaww.eth",
          tokenized_label: ["a", "a", "ww"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "available",
            categories: [],
            cached_interesting_score: 0.9256856428571429,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Nasdaq ens index",
            collection_id: "KrlYQ_DEa4lI",
            grouping_category: "related",
          },
        },
        {
          name: "aaxj.eth",
          tokenized_label: ["a", "a", "xj"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "available",
            categories: [],
            cached_interesting_score: 0.9256856428571429,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Nasdaq ens index",
            collection_id: "KrlYQ_DEa4lI",
            grouping_category: "related",
          },
        },
        {
          name: "aaxn.eth",
          tokenized_label: ["a", "a", "xn"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "available",
            categories: [],
            cached_interesting_score: 0.9256856428571429,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Nasdaq ens index",
            collection_id: "KrlYQ_DEa4lI",
            grouping_category: "related",
          },
        },
        {
          name: "abac.eth",
          tokenized_label: ["a", "bac"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9256856428571429,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Nasdaq ens index",
            collection_id: "KrlYQ_DEa4lI",
            grouping_category: "related",
          },
        },
      ],
      name: "Nasdaq ens index",
      type: "related",
      collection_id: "KrlYQ_DEa4lI",
      collection_title: "Nasdaq ens index",
      collection_members_count: 3370,
      related_collections: [],
    },
    {
      suggestions: [
        {
          name: "rihanna.eth",
          tokenized_label: ["rihanna"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "on_sale",
            categories: ["pre-punk-club"],
            cached_interesting_score: 0.93416500912691,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Hip hop musicians",
            collection_id: "pQ5br1AM8WS0",
            grouping_category: "related",
          },
        },
        {
          name: "willsmith.eth",
          tokenized_label: ["will", "smith"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: ["pre-punk-club"],
            cached_interesting_score: 0.9332909517381152,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Hip hop musicians",
            collection_id: "pQ5br1AM8WS0",
            grouping_category: "related",
          },
        },
        {
          name: "kanyewest.eth",
          tokenized_label: ["kanye", "west"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: ["pre-punk-club"],
            cached_interesting_score: 0.9337586816272143,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Hip hop musicians",
            collection_id: "pQ5br1AM8WS0",
            grouping_category: "related",
          },
        },
        {
          name: "eminem.eth",
          tokenized_label: ["eminem"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9351914162976419,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Hip hop musicians",
            collection_id: "pQ5br1AM8WS0",
            grouping_category: "related",
          },
        },
        {
          name: "miakhalifa.eth",
          tokenized_label: ["mia", "khalifa"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9213570714285714,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Hip hop musicians",
            collection_id: "pQ5br1AM8WS0",
            grouping_category: "related",
          },
        },
        {
          name: "beyonce.eth",
          tokenized_label: ["beyonce"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: ["pre-punk-club"],
            cached_interesting_score: 0.9341775137030355,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Hip hop musicians",
            collection_id: "pQ5br1AM8WS0",
            grouping_category: "related",
          },
        },
        {
          name: "snoopdogg.eth",
          tokenized_label: ["snoop", "dogg"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.93368717771528,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Hip hop musicians",
            collection_id: "pQ5br1AM8WS0",
            grouping_category: "related",
          },
        },
        {
          name: "johncena.eth",
          tokenized_label: ["john", "cena"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "on_sale",
            categories: ["pre-punk-club"],
            cached_interesting_score: 0.9317296230595444,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Hip hop musicians",
            collection_id: "pQ5br1AM8WS0",
            grouping_category: "related",
          },
        },
        {
          name: "badbunny.eth",
          tokenized_label: ["bad", "bunny"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9319430771721644,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Hip hop musicians",
            collection_id: "pQ5br1AM8WS0",
            grouping_category: "related",
          },
        },
        {
          name: "coolio.eth",
          tokenized_label: ["coolio"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9336629773865515,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Hip hop musicians",
            collection_id: "pQ5br1AM8WS0",
            grouping_category: "related",
          },
        },
      ],
      name: "Hip hop musicians",
      type: "related",
      collection_id: "pQ5br1AM8WS0",
      collection_title: "Hip hop musicians",
      collection_members_count: 3630,
      related_collections: [
        {
          collection_id: "jTJ9_LeXwJXZ",
          collection_title: "21st-century American rappers",
          collection_members_count: 2235,
        },
        {
          collection_id: "OfgxmgCvRDE0",
          collection_title:
            "Artists who reached number one in the United States",
          collection_members_count: 510,
        },
        {
          collection_id: "1JP3OOWspX8Q",
          collection_title:
            "Artists who reached number one on the U.S. Rhythmic chart",
          collection_members_count: 255,
        },
      ],
    },
    {
      suggestions: [
        {
          name: "cthulhu.eth",
          tokenized_label: ["cthulhu"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: ["pre-punk-club"],
            cached_interesting_score: 0.9337372742247482,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Fictional deities",
            collection_id: "qdeq7I9z0_jv",
            grouping_category: "related",
          },
        },
        {
          name: "vecna.eth",
          tokenized_label: ["vecna"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9249642142857143,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Fictional deities",
            collection_id: "qdeq7I9z0_jv",
            grouping_category: "related",
          },
        },
        {
          name: "azathoth.eth",
          tokenized_label: ["azathoth"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9227999285714287,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Fictional deities",
            collection_id: "qdeq7I9z0_jv",
            grouping_category: "related",
          },
        },
        {
          name: "aslan.eth",
          tokenized_label: ["aslan"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9335898131750734,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Fictional deities",
            collection_id: "qdeq7I9z0_jv",
            grouping_category: "related",
          },
        },
        {
          name: "raiden.eth",
          tokenized_label: ["raiden"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9319972328361049,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Fictional deities",
            collection_id: "qdeq7I9z0_jv",
            grouping_category: "related",
          },
        },
        {
          name: "beerus.eth",
          tokenized_label: ["beerus"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.932687909308781,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Fictional deities",
            collection_id: "qdeq7I9z0_jv",
            grouping_category: "related",
          },
        },
        {
          name: "ares.eth",
          tokenized_label: ["ares"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: ["4-letter-dictionary"],
            cached_interesting_score: 0.9342015799099385,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Fictional deities",
            collection_id: "qdeq7I9z0_jv",
            grouping_category: "related",
          },
        },
        {
          name: "tiamat.eth",
          tokenized_label: ["tiamat"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9242427857142858,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Fictional deities",
            collection_id: "qdeq7I9z0_jv",
            grouping_category: "related",
          },
        },
        {
          name: "bahamut.eth",
          tokenized_label: ["bahamut"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9235213571428572,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Fictional deities",
            collection_id: "qdeq7I9z0_jv",
            grouping_category: "related",
          },
        },
        {
          name: "nyarlathotep.eth",
          tokenized_label: ["nyarlathotep"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9199142142857143,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Fictional deities",
            collection_id: "qdeq7I9z0_jv",
            grouping_category: "related",
          },
        },
      ],
      name: "Fictional deities",
      type: "related",
      collection_id: "qdeq7I9z0_jv",
      collection_title: "Fictional deities",
      collection_members_count: 24,
      related_collections: [
        {
          collection_id: "w7zfTIlaiiV0",
          collection_title: "Fictional goddesses",
          collection_members_count: 49,
        },
        {
          collection_id: "gSk1eVlVOR7K",
          collection_title: "Greyhawk deities",
          collection_members_count: 85,
        },
        {
          collection_id: "bSvp09tRejA5",
          collection_title: "War deities",
          collection_members_count: 49,
        },
      ],
    },
    {
      suggestions: [
        {
          name: "aphrodite.eth",
          tokenized_label: ["aphrodite"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: ["pre-punk-club"],
            cached_interesting_score: 0.9345334023883688,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Greek mythological figures",
            collection_id: "3vkCFOZ101p1",
            grouping_category: "related",
          },
        },
        {
          name: "apollo.eth",
          tokenized_label: ["apollo"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9347188835493739,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Greek mythological figures",
            collection_id: "3vkCFOZ101p1",
            grouping_category: "related",
          },
        },
        {
          name: "artemis.eth",
          tokenized_label: ["artemis"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: ["pre-punk-club"],
            cached_interesting_score: 0.9339824583642776,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Greek mythological figures",
            collection_id: "3vkCFOZ101p1",
            grouping_category: "related",
          },
        },
        {
          name: "tauropolia.eth",
          tokenized_label: ["tauropolia"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "available",
            categories: [],
            cached_interesting_score: null,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Greek mythological figures",
            collection_id: "3vkCFOZ101p1",
            grouping_category: "related",
          },
        },
        {
          name: "prometheus.eth",
          tokenized_label: ["prometheus"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: ["pre-punk-club"],
            cached_interesting_score: 0.9338166472202342,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Greek mythological figures",
            collection_id: "3vkCFOZ101p1",
            grouping_category: "related",
          },
        },
        {
          name: "athena.eth",
          tokenized_label: ["athena"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9342306373876131,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Greek mythological figures",
            collection_id: "3vkCFOZ101p1",
            grouping_category: "related",
          },
        },
        {
          name: "hermes.eth",
          tokenized_label: ["hermes"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9341364442044858,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Greek mythological figures",
            collection_id: "3vkCFOZ101p1",
            grouping_category: "related",
          },
        },
        {
          name: "dionysus.eth",
          tokenized_label: ["dionysus"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: ["pre-punk-club"],
            cached_interesting_score: 0.9335100731094788,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Greek mythological figures",
            collection_id: "3vkCFOZ101p1",
            grouping_category: "related",
          },
        },
        {
          name: "gaia.eth",
          tokenized_label: ["gaia"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "on_sale",
            categories: [],
            cached_interesting_score: 0.9340022634899843,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Greek mythological figures",
            collection_id: "3vkCFOZ101p1",
            grouping_category: "related",
          },
        },
        {
          name: "hephaestus.eth",
          tokenized_label: ["hephaestus"],
          metadata: {
            pipeline_name: "collections",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: ["pre-punk-club"],
            cached_interesting_score: 0.9329308909703308,
            applied_strategies: [
              ["CollectionGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: "Greek mythological figures",
            collection_id: "3vkCFOZ101p1",
            grouping_category: "related",
          },
        },
      ],
      name: "Greek mythological figures",
      type: "related",
      collection_id: "3vkCFOZ101p1",
      collection_title: "Greek mythological figures",
      collection_members_count: 389,
      related_collections: [
        {
          collection_id: "8ryeXBsb7cLH",
          collection_title: "Homeric characters",
          collection_members_count: 185,
        },
        {
          collection_id: "4BnQ_nLZ7R6m",
          collection_title: "Natural satellites",
          collection_members_count: 268,
        },
        {
          collection_id: "sHTpoWxoJQKF",
          collection_title: "Ship infoboxes without an image",
          collection_members_count: 9163,
        },
      ],
    },
    {
      suggestions: [
        {
          name: "hera.eth",
          tokenized_label: ["hera"],
          metadata: {
            pipeline_name: "wiki2v",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9344780276294581,
            applied_strategies: [
              ["Wikipedia2VGeneratorRocks", "SubnameFilter", "ValidNameFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "alternates",
          },
        },
        {
          name: "poseidon.eth",
          tokenized_label: ["poseidon"],
          metadata: {
            pipeline_name: "wiki2v",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9337912877443942,
            applied_strategies: [
              ["Wikipedia2VGeneratorRocks", "SubnameFilter", "ValidNameFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "alternates",
          },
        },
        {
          name: "hades.eth",
          tokenized_label: ["hades"],
          metadata: {
            pipeline_name: "w2v",
            interpretation: ["ngram", "en", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: ["5-letter-dictionary"],
            cached_interesting_score: 0.9337077711111714,
            applied_strategies: [
              ["W2VGeneratorRocks", "SubnameFilter", "ValidNameFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "alternates",
          },
        },
        {
          name: "cronus.eth",
          tokenized_label: ["cronus"],
          metadata: {
            pipeline_name: "wiki2v",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9330363811017428,
            applied_strategies: [
              ["Wikipedia2VGeneratorRocks", "SubnameFilter", "ValidNameFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "alternates",
          },
        },
        {
          name: "heracles.eth",
          tokenized_label: ["heracles"],
          metadata: {
            pipeline_name: "wiki2v",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9333503625197433,
            applied_strategies: [
              ["Wikipedia2VGeneratorRocks", "SubnameFilter", "ValidNameFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "alternates",
          },
        },
        {
          name: "odin.eth",
          tokenized_label: ["odin"],
          metadata: {
            pipeline_name: "w2v",
            interpretation: ["ngram", "en", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9338347292537851,
            applied_strategies: [
              ["W2VGeneratorRocks", "SubnameFilter", "ValidNameFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "alternates",
          },
        },
        {
          name: "thor.eth",
          tokenized_label: ["thor"],
          metadata: {
            pipeline_name: "w2v",
            interpretation: ["ngram", "en", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9341943892124795,
            applied_strategies: [
              ["W2VGeneratorRocks", "SubnameFilter", "ValidNameFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "alternates",
          },
        },
        {
          name: "persephone.eth",
          tokenized_label: ["persephone"],
          metadata: {
            pipeline_name: "wiki2v",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9336159397566627,
            applied_strategies: [
              ["Wikipedia2VGeneratorRocks", "SubnameFilter", "ValidNameFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "alternates",
          },
        },
        {
          name: "asgard.eth",
          tokenized_label: ["asgard"],
          metadata: {
            pipeline_name: "w2v",
            interpretation: ["ngram", "en", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9333042427168736,
            applied_strategies: [
              ["W2VGeneratorRocks", "SubnameFilter", "ValidNameFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "alternates",
          },
        },
        {
          name: "darth.eth",
          tokenized_label: ["darth"],
          metadata: {
            pipeline_name: "w2v",
            interpretation: ["ngram", "en", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9341470623288606,
            applied_strategies: [
              ["W2VGeneratorRocks", "SubnameFilter", "ValidNameFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "alternates",
          },
        },
      ],
      name: "Alternates",
      type: "alternates",
    },
    {
      suggestions: [
        {
          name: "🆉🅴🆄🆂.eth",
          tokenized_label: ["🆉🅴🆄🆂"],
          metadata: {
            pipeline_name: "keycap",
            interpretation: ["ngram", "en", "{'tokens': ('zeus',)}"],
            cached_status: "available",
            categories: [],
            cached_interesting_score: null,
            applied_strategies: [
              ["KeycapGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "emojify",
          },
        },
        {
          name: "zeus🇺🇸.eth",
          tokenized_label: ["zeus", "🇺🇸"],
          metadata: {
            pipeline_name: "flag-affix",
            interpretation: [
              "ngram",
              "en",
              "{'tokens': ('zeus',), 'country': 'US'}",
            ],
            cached_status: "available",
            categories: [],
            cached_interesting_score: null,
            applied_strategies: [
              ["FlagAffixGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "emojify",
          },
        },
        {
          name: "🇺🇸zeus.eth",
          tokenized_label: ["🇺🇸", "zeus"],
          metadata: {
            pipeline_name: "flag-affix",
            interpretation: [
              "ngram",
              "en",
              "{'tokens': ('zeus',), 'country': 'US'}",
            ],
            cached_status: "available",
            categories: [],
            cached_interesting_score: null,
            applied_strategies: [
              ["FlagAffixGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "emojify",
          },
        },
        {
          name: "zeus🔥.eth",
          tokenized_label: ["zeus", "🔥"],
          metadata: {
            pipeline_name: "person-name-emojify",
            interpretation: [
              "person",
              "zh",
              "{'tokens': ('zeus',), 'gender': 'M'}",
            ],
            cached_status: "available",
            categories: [],
            cached_interesting_score: null,
            applied_strategies: [
              [
                "PersonNameEmojifyGenerator",
                "SubnameFilter",
                "ValidNameLengthFilter",
              ],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "emojify",
          },
        },
        {
          name: "zeus❤‍🔥.eth",
          tokenized_label: ["zeus", "❤‍🔥"],
          metadata: {
            pipeline_name: "person-name-emojify",
            interpretation: [
              "person",
              "zh",
              "{'tokens': ('zeus',), 'gender': 'M'}",
            ],
            cached_status: "available",
            categories: [],
            cached_interesting_score: null,
            applied_strategies: [
              [
                "PersonNameEmojifyGenerator",
                "SubnameFilter",
                "ValidNameLengthFilter",
              ],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "emojify",
          },
        },
        {
          name: "zeus🐐.eth",
          tokenized_label: ["zeus", "🐐"],
          metadata: {
            pipeline_name: "person-name-emojify",
            interpretation: [
              "person",
              "zh",
              "{'tokens': ('zeus',), 'gender': 'M'}",
            ],
            cached_status: "available",
            categories: [],
            cached_interesting_score: null,
            applied_strategies: [
              [
                "PersonNameEmojifyGenerator",
                "SubnameFilter",
                "ValidNameLengthFilter",
              ],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "emojify",
          },
        },
        {
          name: "zeus🐲.eth",
          tokenized_label: ["zeus", "🐲"],
          metadata: {
            pipeline_name: "person-name-emojify",
            interpretation: [
              "person",
              "zh",
              "{'tokens': ('zeus',), 'gender': 'M'}",
            ],
            cached_status: "available",
            categories: [],
            cached_interesting_score: null,
            applied_strategies: [
              [
                "PersonNameEmojifyGenerator",
                "SubnameFilter",
                "ValidNameLengthFilter",
              ],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "emojify",
          },
        },
        {
          name: "zeus😍.eth",
          tokenized_label: ["zeus", "😍"],
          metadata: {
            pipeline_name: "person-name-emojify",
            interpretation: [
              "person",
              "zh",
              "{'tokens': ('zeus',), 'gender': 'M'}",
            ],
            cached_status: "available",
            categories: [],
            cached_interesting_score: null,
            applied_strategies: [
              [
                "PersonNameEmojifyGenerator",
                "SubnameFilter",
                "ValidNameLengthFilter",
              ],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "emojify",
          },
        },
        {
          name: "💲zeus.eth",
          tokenized_label: ["💲", "zeus"],
          metadata: {
            pipeline_name: "person-name-emojify",
            interpretation: [
              "person",
              "zh",
              "{'tokens': ('zeus',), 'gender': 'M'}",
            ],
            cached_status: "available",
            categories: [],
            cached_interesting_score: null,
            applied_strategies: [
              [
                "PersonNameEmojifyGenerator",
                "SubnameFilter",
                "ValidNameLengthFilter",
              ],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "emojify",
          },
        },
      ],
      name: "😍 Emojify",
      type: "emojify",
    },
    {
      suggestions: [
        {
          name: "notzeus.eth",
          tokenized_label: ["notzeus"],
          metadata: {
            pipeline_name: "substring",
            interpretation: ["person", "zh", "{'tokens': ('zeus', 'zeus')}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9322892002484311,
            applied_strategies: [["SubstringMatchGenerator", "SubnameFilter"]],
            collection_title: null,
            collection_id: null,
            grouping_category: "community",
          },
        },
        {
          name: "azeus.eth",
          tokenized_label: ["a", "zeus"],
          metadata: {
            pipeline_name: "on-sale",
            interpretation: ["ngram", "en", "{'tokens': ('zeus',)}"],
            cached_status: "on_sale",
            categories: [],
            cached_interesting_score: 0.9325452363611946,
            applied_strategies: [
              ["OnSaleMatchGenerator", "SubnameFilter", "ValidNameFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "community",
          },
        },
        {
          name: "zeusliving.eth",
          tokenized_label: ["zeus", "living"],
          metadata: {
            pipeline_name: "on-sale",
            interpretation: ["ngram", "en", "{'tokens': ('zeus',)}"],
            cached_status: "on_sale",
            categories: [],
            cached_interesting_score: 0.931758218473495,
            applied_strategies: [
              ["OnSaleMatchGenerator", "SubnameFilter", "ValidNameFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "community",
          },
        },
        {
          name: "zeusor.eth",
          tokenized_label: ["zeusor"],
          metadata: {
            pipeline_name: "substring",
            interpretation: ["person", "zh", "{'tokens': ('zeus', 'zeus')}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9322860360938966,
            applied_strategies: [["SubstringMatchGenerator", "SubnameFilter"]],
            collection_title: null,
            collection_id: null,
            grouping_category: "community",
          },
        },
        {
          name: "sonofzeus.eth",
          tokenized_label: ["son", "of", "zeus"],
          metadata: {
            pipeline_name: "on-sale",
            interpretation: ["ngram", "en", "{'tokens': ('zeus',)}"],
            cached_status: "on_sale",
            categories: [],
            cached_interesting_score: 0.9314173570778157,
            applied_strategies: [
              ["OnSaleMatchGenerator", "SubnameFilter", "ValidNameFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "community",
          },
        },
        {
          name: "vipzeus.eth",
          tokenized_label: ["vip", "zeus"],
          metadata: {
            pipeline_name: "on-sale",
            interpretation: ["ngram", "en", "{'tokens': ('zeus',)}"],
            cached_status: "on_sale",
            categories: [],
            cached_interesting_score: 0.931409932288582,
            applied_strategies: [
              ["OnSaleMatchGenerator", "SubnameFilter", "ValidNameFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "community",
          },
        },
        {
          name: "yourzeus.eth",
          tokenized_label: ["yourzeus"],
          metadata: {
            pipeline_name: "substring",
            interpretation: ["person", "zh", "{'tokens': ('zeus', 'zeus')}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9322424637700685,
            applied_strategies: [["SubstringMatchGenerator", "SubnameFilter"]],
            collection_title: null,
            collection_id: null,
            grouping_category: "community",
          },
        },
        {
          name: "hazeus.eth",
          tokenized_label: ["hazeus"],
          metadata: {
            pipeline_name: "substring",
            interpretation: ["person", "zh", "{'tokens': ('zeus', 'zeus')}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9322099764498634,
            applied_strategies: [["SubstringMatchGenerator", "SubnameFilter"]],
            collection_title: null,
            collection_id: null,
            grouping_category: "community",
          },
        },
        {
          name: "nftzeus.eth",
          tokenized_label: ["nft", "zeus"],
          metadata: {
            pipeline_name: "on-sale",
            interpretation: ["ngram", "en", "{'tokens': ('zeus',)}"],
            cached_status: "on_sale",
            categories: [],
            cached_interesting_score: 0.9310211490173341,
            applied_strategies: [
              ["OnSaleMatchGenerator", "SubnameFilter", "ValidNameFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "community",
          },
        },
        {
          name: "bitcoinzeus.eth",
          tokenized_label: ["bit", "coin", "zeus"],
          metadata: {
            pipeline_name: "on-sale",
            interpretation: ["ngram", "en", "{'tokens': ('zeus',)}"],
            cached_status: "on_sale",
            categories: [],
            cached_interesting_score: 0.9306930477336799,
            applied_strategies: [
              ["OnSaleMatchGenerator", "SubnameFilter", "ValidNameFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "community",
          },
        },
      ],
      name: "Community",
      type: "community",
    },
    {
      suggestions: [
        {
          name: "zeusdeus.eth",
          tokenized_label: ["zeus", "deus"],
          metadata: {
            pipeline_name: "rhymes",
            interpretation: ["ngram", "en", "{'tokens': ('zeus',)}"],
            cached_status: "available",
            categories: [],
            cached_interesting_score: null,
            applied_strategies: [
              ["RhymesGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "expand",
          },
        },
        {
          name: "$zeus.eth",
          tokenized_label: ["$", "zeus"],
          metadata: {
            pipeline_name: "person-name-expand",
            interpretation: [
              "person",
              "zh",
              "{'tokens': ('zeus',), 'gender': 'M'}",
            ],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.6392498571428572,
            applied_strategies: [
              [
                "PersonNameExpandGenerator",
                "SubnameFilter",
                "ValidNameLengthFilter",
              ],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "expand",
          },
        },
        {
          name: "_zeus.eth",
          tokenized_label: ["_", "zeus"],
          metadata: {
            pipeline_name: "special-char-affix",
            interpretation: ["other", "default", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.6392498571428572,
            applied_strategies: [
              [
                "SpecialCharacterAffixGenerator",
                "SubnameFilter",
                "ValidNameLengthFilter",
              ],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "expand",
          },
        },
        {
          name: "ξzeus.eth",
          tokenized_label: ["ξ", "zeus"],
          metadata: {
            pipeline_name: "special-char-affix",
            interpretation: ["other", "default", "{'tokens': ('zeus',)}"],
            cached_status: "available",
            categories: [],
            cached_interesting_score: null,
            applied_strategies: [
              [
                "SpecialCharacterAffixGenerator",
                "SubnameFilter",
                "ValidNameLengthFilter",
              ],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "expand",
          },
        },
        {
          name: "zeuser.eth",
          tokenized_label: ["zeus", "er"],
          metadata: {
            pipeline_name: "suffix",
            interpretation: ["ngram", "en", "{'tokens': ('zeus',)}"],
            cached_status: "available",
            categories: [],
            cached_interesting_score: null,
            applied_strategies: [
              ["SuffixGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "expand",
          },
        },
        {
          name: "zeusseuss.eth",
          tokenized_label: ["zeus", "seuss"],
          metadata: {
            pipeline_name: "rhymes",
            interpretation: ["ngram", "en", "{'tokens': ('zeus',)}"],
            cached_status: "available",
            categories: [],
            cached_interesting_score: null,
            applied_strategies: [
              ["RhymesGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "expand",
          },
        },
        {
          name: "thezeus.eth",
          tokenized_label: ["the", "zeus"],
          metadata: {
            pipeline_name: "prefix",
            interpretation: ["ngram", "en", "{'tokens': ('zeus',)}"],
            cached_status: "available",
            categories: [],
            cached_interesting_score: 0.9327633289795375,
            applied_strategies: [
              ["PrefixGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "expand",
          },
        },
        {
          name: "drzeus.eth",
          tokenized_label: ["dr", "zeus"],
          metadata: {
            pipeline_name: "person-name-expand",
            interpretation: [
              "person",
              "zh",
              "{'tokens': ('zeus',), 'gender': 'M'}",
            ],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9316432752500653,
            applied_strategies: [
              [
                "PersonNameExpandGenerator",
                "SubnameFilter",
                "ValidNameLengthFilter",
              ],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "expand",
          },
        },
        {
          name: "zeusξ.eth",
          tokenized_label: ["zeus", "ξ"],
          metadata: {
            pipeline_name: "special-char-affix",
            interpretation: ["other", "default", "{'tokens': ('zeus',)}"],
            cached_status: "available",
            categories: [],
            cached_interesting_score: null,
            applied_strategies: [
              [
                "SpecialCharacterAffixGenerator",
                "SubnameFilter",
                "ValidNameLengthFilter",
              ],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "expand",
          },
        },
        {
          name: "zeusnft.eth",
          tokenized_label: ["zeus", "nft"],
          metadata: {
            pipeline_name: "suffix",
            interpretation: ["ngram", "en", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9310205975837114,
            applied_strategies: [
              ["SuffixGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "expand",
          },
        },
      ],
      name: "Expand",
      type: "expand",
    },
    {
      suggestions: [
        {
          name: "23v5.eth",
          tokenized_label: ["23v5"],
          metadata: {
            pipeline_name: "leet",
            interpretation: ["ngram", "en", "{'tokens': ('zeus',)}"],
            cached_status: "available",
            categories: [],
            cached_interesting_score: null,
            applied_strategies: [
              ["LeetGenerator", "SubnameFilter", "ValidNameFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "gowild",
          },
        },
        {
          name: "2ev5.eth",
          tokenized_label: ["2ev5"],
          metadata: {
            pipeline_name: "leet",
            interpretation: ["ngram", "en", "{'tokens': ('zeus',)}"],
            cached_status: "available",
            categories: [],
            cached_interesting_score: null,
            applied_strategies: [
              ["LeetGenerator", "SubnameFilter", "ValidNameFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "gowild",
          },
        },
        {
          name: "suez.eth",
          tokenized_label: ["suez"],
          metadata: {
            pipeline_name: "reverse",
            interpretation: ["person", "zh", "{'tokens': ('zeus',)}"],
            cached_status: "taken",
            categories: [],
            cached_interesting_score: 0.9336886537620249,
            applied_strategies: [
              ["ReverseGenerator", "SubnameFilter", "ValidNameLengthFilter"],
            ],
            collection_title: null,
            collection_id: null,
            grouping_category: "gowild",
          },
        },
      ],
      name: "Go Wild",
      type: "gowild",
    },
  ],
  all_tokenizations: [["zeus"]],
};
