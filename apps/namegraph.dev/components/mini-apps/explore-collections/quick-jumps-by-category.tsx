/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Skeleton from "@/components/skeleton";
import {
  NameGraphFetchTopCollectionMembersResponse,
  NameGraphGroupedByCategoryResponse,
  NameGraphGroupingCategory,
  NameGraphRelatedCollectionResponse,
} from "@namehash/namegraph-sdk/utils";
import { ArrowNavigationBar } from "./arrow-navigation-bar";
import { NameGraphSuggestionCategoryTypes } from "@/lib/utils";

interface QuickJumpsByCategoryProps {
  search: string;
  activeCategoryID: string;
  /**
   * undefined is set when component never tried querying name ideas
   * null is set when component tried querying name ideas but failed
   * NameGraphGroupedByCategoryResponse is set when name ideas were successfully queried
   */
  nameIdeas: undefined | null | NameGraphGroupedByCategoryResponse;
}

export const QuickJumpsByCategory = ({
  search,
  nameIdeas,
  activeCategoryID,
}: QuickJumpsByCategoryProps) => {
  /**
   * quickJumpCategories state:
   *
   * undefined is set when nameIdeas was not yet parsed
   * null is set if nameIdeas was parsed but does not contain an array of categories
   * NameGraphFetchTopCollectionMembersResponse[] is set if nameIdeas categories were parsed into quickJumpCategories
   */
  const [quickJumpCategories, setQuickJumpCategories] = useState<
    undefined | null | NameGraphFetchTopCollectionMembersResponse[]
  >(undefined);
  const [loadingQuickJumpPills, setLoadingQuickJumpPills] =
    useState<boolean>(true);

  // Start of navigation buttons logic
  const buildQuickJumpPills = () => {
    if (nameIdeas && Array.isArray(nameIdeas.categories)) {
      const options: any[] = [];

      nameIdeas?.categories.forEach((category: any) => {
        options.push(category);
      });

      setQuickJumpCategories(options);
    } else {
      setQuickJumpCategories(null);
    }
  };

  const quickJumpTo = (
    category: NameGraphFetchTopCollectionMembersResponse,
  ) => {
    scrollToNameIdeasCategory(category);
  };

  useEffect(() => {
    buildQuickJumpPills();
  }, [nameIdeas?.categories]);

  useEffect(() => {
    if (quickJumpCategories) {
      setTimeout(() => {
        setLoadingQuickJumpPills(false);
      }, 5000);
    }
  }, [quickJumpCategories]);

  useEffect(() => {
    setLoadingQuickJumpPills(true);
  }, [search]);

  if (nameIdeas?.categories === null) return null;

  return (
    <div className="w-full px-3 relative bg-white border-b border-gray-300 pt-3 border-t">
      <h2 className="text-lg font-regular mb-4 text-center">
        📚 Collections and name ideas found for{" "}
        <b>{search.includes(".") ? search.split(".")[0] : search}</b> ⬇️
      </h2>
      {!quickJumpCategories || loadingQuickJumpPills ? (
        <div className="mx-3 px-2 mb-3 md:px-7 lg:px-12">
          <QuickJumpPillsSkeleton />
        </div>
      ) : (
        <div
          className="
            pb-3 transition-all md:px-10 lg:px-[60px]"
        >
          <ArrowNavigationBar
            skeletonMarkup={<QuickJumpPillsSkeleton />}
            centerID={activeCategoryID}
            barContentMarkup={
              <div className="flex space-x-2">
                {/* Quick jump pills */}
                {quickJumpCategories?.map((category) => {
                  return (
                    <button
                      onClick={() => quickJumpTo(category)}
                      data-collection-pill={category.name}
                      key={`${category.type}-${category.name}`}
                      data-navigation-item={getCategoryID(category)}
                      className={`collectionPill first:-pl-2 px-4 last:-mr-2 flex flex-nowrap cursor-pointer py-2 rounded-[20px] relative transition
                        ${
                          activeCategoryID === getCategoryID(category)
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-gray-100 text-black hover:bg-gray-200"
                        }
                      `}
                    >
                      <p className="text-sm font-medium w-max cursor-pointer">
                        {category.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};

const QuickJumpPillsSkeleton = () => {
  return (
    <div className="flex space-x-2 overflow-hidden">
      {[...Array(NameGraphSuggestionCategoryTypes.length).fill(0)].map(
        (idx) => (
          <Skeleton
            roundedClass="rounded-[20px]"
            className="h-9 min-w-32 max-w-32"
            key={idx}
          />
        ),
      )}
    </div>
  );
};

export const getCategoryID = (
  category: NameGraphFetchTopCollectionMembersResponse,
) => {
  const postfix =
    category.type === NameGraphGroupingCategory.related
      ? `${category.name}-${
          (category as NameGraphRelatedCollectionResponse).collection_id
        }`
      : `${category.name}`;

  return `${category.type}-category-${postfix}`;
};

export const scrollToNameIdeasCategory = (
  category: NameGraphFetchTopCollectionMembersResponse,
) => {
  const categoryID = getCategoryID(category);

  if (categoryID) {
    const scrollableContainer = document.getElementById("scrollable-elm");
    const categoryElm = document.getElementById(categoryID);

    const categoryElmTopPosition = Number(
      categoryElm?.getAttribute("data-category-top"),
    );
    console.log(categoryElmTopPosition, categoryElm, scrollableContainer);
    if (scrollableContainer && categoryElm && categoryElmTopPosition) {
      setTimeout(() => {
        scrollableContainer.scrollTo({
          top: categoryElmTopPosition - 375,
          behavior: "smooth",
        });
      }, 100);
    }
  }
};
