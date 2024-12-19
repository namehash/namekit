/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import lodash from "lodash";
import {
  getCategoryID,
  scrollToNameIdeasCategory,
} from "./quick-jumps-by-category";
import { NameGraphGroupingCategory } from "@namehash/namegraph-sdk/utils";
import {
  NameGraphRelatedCollection,
  NameGraphSuggestionCategory,
} from "@/lib/utils";
import { RecursiveRelatedCollectionPills } from "./recursive-related-collection-pills";
import { SuggestionCategoryHeader } from "./suggestion-category-header";
import Skeleton from "@/components/skeleton";

interface SuggestionCategoryProps {
  category: NameGraphSuggestionCategory | null; // when null we display a skeleton
}

/*
  Whenever a user is scrolling through Name Ideas
  categories, the active Quick Jump Pill is being updated
  based on  the currently visible category. We consider a
  category as  active if it is the first category that is
  visible in the viewport. However, when category C is not yet
  visible anymore but the viewport has not reached category C+1
  top position yet, since these are separated by a white spacing,
  we want to consider category C+1 as active. This is what the below
  constant is used for: it is the amount of pixels that we consider between
  the top of a category and the top of NameIdeas container to consider it active.
*/
const CATEGORY_TOP_OFFEST_TO_CONSIDER_IT_ACTIVE = 32;

export const SuggestionCategory = ({ category }: SuggestionCategoryProps) => {
  const [relatedCollectionsList, setRelatedCollectionsList] = useState<
    NameGraphRelatedCollection[] | null
  >(null);

  useEffect(() => {
    if (category) {
      if (category?.type === NameGraphGroupingCategory.related) {
        setRelatedCollectionsList(category.related_collections);
      }
    }
  }, [category]);

  useEffect(() => {
    setTimeout(() => {
      setCategoryDimensions();
    }, 4000);
  }, []);

  const setCategoryDimensions = () => {
    if (!category) return;

    const categoryElm = document.getElementById(getCategoryID(category));
    const categoryTop = categoryElm?.getBoundingClientRect().top;
    const categoryBottom = categoryElm?.getBoundingClientRect().bottom;

    const wrapperElm = document.getElementById("scrollable-elm");
    const wrapperScrollTop = Number(wrapperElm?.scrollTop);

    let categoryTopRelativeToWrapper =
      Number(categoryTop) - CATEGORY_TOP_OFFEST_TO_CONSIDER_IT_ACTIVE;
    let categoryBottomRelativeToWrapper = Number(categoryBottom);

    if (wrapperScrollTop > 0) {
      categoryTopRelativeToWrapper =
        categoryTopRelativeToWrapper + Number(wrapperScrollTop);
      categoryBottomRelativeToWrapper =
        categoryBottomRelativeToWrapper + Number(wrapperScrollTop);
    }

    if (categoryElm) {
      categoryElm.setAttribute(
        "data-category-top",
        categoryTopRelativeToWrapper.toString(),
      );
      categoryElm.setAttribute(
        "data-category-bottom",
        categoryBottomRelativeToWrapper.toString(),
      );
    }
  };

  useEffect(() => {
    window.addEventListener(
      "scroll",
      lodash.debounce(setCategoryDimensions, 100),
    );

    return () => {
      window.removeEventListener(
        "scroll",
        lodash.debounce(setCategoryDimensions, 100),
      );
    };
  }, []);

  const loadingSkeletonMarkup = (
    <div className="w-full">
      {category ? (
        <>{category.name}</>
      ) : (
        <SuggestionCategoryHeader category={category} />
      )}
      <div className="mt-3">
        <Skeleton />
      </div>
    </div>
  );

  useEffect(() => {
    window.addEventListener(
      "resize",
      lodash.debounce(setCategoryDimensions, 100),
    );

    return () => {
      window.removeEventListener(
        "resize",
        lodash.debounce(setCategoryDimensions, 100),
      );
    };
  }, []);

  const customizedPillsColors = [
    "#E7DBF7",
    "#1FA3C7",
    "#FE097C",
    "#FFBE00",
    "#DB3D58",
    "#01C69A",
    "#8464CA",
    "#E84233",
    "#F5851E",
    "#CBECEC",
    "#FDE2CB",
    "#F0C3F3",
  ];

  const getRandomCustomizedPill = () => {
    const defaultClasses = "rounded-xl px-2.5 py-1 bg-opacity-70";

    const randomColor =
      customizedPillsColors[
        Math.floor(Math.random() * customizedPillsColors.length)
      ];

    return `bg-[${randomColor}] ${defaultClasses}`;
  };

  return (
    <>
      {!category ? (
        loadingSkeletonMarkup
      ) : (
        <div className="px-5 md:px-10 lg:px-[60px]">
          {category.suggestions.length === 0 ? (
            loadingSkeletonMarkup
          ) : (
            <div>
              <div>
                <SuggestionCategoryHeader category={category} />
                <div className="flex flex-col m-2 space-y-2">
                  {category.suggestions
                    ? category.suggestions.map((suggestion) => {
                        return (
                          <div
                            className={getRandomCustomizedPill()}
                            key={suggestion.name}
                          >
                            {suggestion.name}
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="px-5 md:px-10 lg:px-[60px]">
        {category?.type === NameGraphGroupingCategory.related ? (
          <>
            {relatedCollectionsList ? (
              <RecursiveRelatedCollectionPills
                recursiveRelatedCollections={relatedCollectionsList}
              />
            ) : (
              <Skeleton />
            )}
          </>
        ) : null}
      </div>
    </>
  );
};
