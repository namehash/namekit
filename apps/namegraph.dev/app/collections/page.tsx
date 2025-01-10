"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import {
  NameGraphCollection,
  NameGraphSortOrderOptions,
} from "@namehash/namegraph-sdk/utils";
import { findCollectionsByString } from "@/lib/utils";
import { DebounceInput } from "react-debounce-input";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import {
  CollectionsCardsSkeleton,
  CollectionsGridSkeleton,
} from "@/components/collections/collections-grid-skeleton";
import { useQueryParams } from "@/components/use-query-params";
import { Noto_Emoji } from "next/font/google";
import { Link } from "@namehash/namekit-react";

const notoBlack = Noto_Emoji({ preload: false });
interface NavigationConfig {
  itemsPerPage: number;
  totalItems?: number;
}

interface CollectionsData {
  sort_order: NameGraphSortOrderOptions;
  other_collections: NameGraphCollection[];
  related_collections: NameGraphCollection[];
}

const FromNameGraphSortOrderToDropdownTextContent: Record<
  NameGraphSortOrderOptions,
  string
> = {
  [NameGraphSortOrderOptions.AI]: "AI with Learning to Rank",
  [NameGraphSortOrderOptions.AZ]: "A-Z (asc)",
  [NameGraphSortOrderOptions.ZA]: "Z-A (des)",
  [NameGraphSortOrderOptions.ES]: "Default scoring",
};

export default function ExploreCollectionsPage() {
  /**
   * Table query
   */
  const DEFAULT_PAGE_NUMBER = 1;
  const DEFAULT_COLLECTIONS_PARAMS: Record<string, any> = {
    search: "",
    page: DEFAULT_PAGE_NUMBER,
    orderBy: NameGraphSortOrderOptions.AI,
  };
  type DefaultDomainFiltersType = typeof DEFAULT_COLLECTIONS_PARAMS;
  const { params, setParams } = useQueryParams<DefaultDomainFiltersType>(
    DEFAULT_COLLECTIONS_PARAMS,
  );

  const handleSearch = (searchTerm: string) => {
    setParams({
      search: searchTerm,
      page: DEFAULT_PAGE_NUMBER, // Resets page when search changes
    });
  };

  const handleOrderBy = (orderBy: NameGraphSortOrderOptions) => {
    setParams({ orderBy });
  };

  const handlePageChange = (page: number) => {
    setParams({ page });
  };

  /**
   * collections state:
   *
   * undefined is set when component never tried querying collections
   * null is set when no collections were retrieved from NameGraph SDK for currentSearch
   * NameGraphCollection[] is set when collections that were retrieved were grouped and state was set
   */
  const [collections, setCollections] = useState<
    undefined | null | Record<number, CollectionsData | null | undefined>
  >(undefined);
  const [collectionsQueriedStandFor, setCollectionsQueriedStandFor] =
    useState("");

  const [loadingCollections, setLoadingCollections] = useState(true);

  const DEFAULT_ITEMS_PER_PAGE = 20;
  const [navigationConfig, setNavigationConfig] = useState<NavigationConfig>({
    itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    totalItems: undefined,
  });

  const loadCollections = () => {
    if (params.search) {
      let query = params.search;
      if (params.search.includes(".")) {
        query = params.search.split(".")[0];
      }

      const MAX_RELATED_COLLECTIONS = 20;
      const OTHER_COLLECTIONS_NUMBER = 5;

      /**
       * This is the case where we have already queried the results for
       * a given page, which is being visited once again and for which
       * we have already stored its necessary data inside collections.
       *
       * There is no need then to re-do a load collections query.
       *
       * Of course this is only true if both the query and the sorting
       * algorithm lastly used are the same. If any of these have changes,
       * we do the loadCollections query once again and update the page's results.
       */
      if (
        !!collectionsQueriedStandFor &&
        collectionsQueriedStandFor === params.search &&
        !!collections?.[params.page] &&
        params.orderBy == collections?.[params.page]?.sort_order
      ) {
        return;
      }

      setLoadingCollections(true);
      setCollectionsQueriedStandFor(query);
      findCollectionsByString(query, {
        offset: params.page - 1,
        sort_order: params.orderBy,
        max_total_collections:
          MAX_RELATED_COLLECTIONS + OTHER_COLLECTIONS_NUMBER,
        /**
         * Please note how the number of collections one page show is
         * strategically aligned with ITEMS_PER_PAGE_OPTIONS.
         */
        max_related_collections: MAX_RELATED_COLLECTIONS,
        max_other_collections: OTHER_COLLECTIONS_NUMBER,
        min_other_collections: OTHER_COLLECTIONS_NUMBER,
      })
        .then((res) => {
          if (res) {
            const MAX_COLLECTIONS_NUMBER_NAME_API_CAN_DOCUMENT = 1000;

            setNavigationConfig({
              ...navigationConfig,
              totalItems:
                typeof res.metadata.total_number_of_matched_collections ===
                "number"
                  ? res.metadata.total_number_of_matched_collections
                  : /**
                     * NameAPI makes usage of a stringified "+1000" for
                     * res.metadata.total_number_of_matched_collections
                     * if there are more than 1000 collections this query
                     * is contained in. Since this is a different data type
                     * and we are handling number operations with totalItems,
                     * we are here normalizing this use case to use the number 1000
                     */
                    MAX_COLLECTIONS_NUMBER_NAME_API_CAN_DOCUMENT,
            });

            const moreCollections = res.other_collections;
            const relatedCollections = res.related_collections;

            setCollections({
              ...collections,
              [params.page]: {
                sort_order: params.orderBy,
                related_collections: relatedCollections,
                other_collections: moreCollections,
              },
            });
            setLoadingCollections(false);
          } else {
            setCollections({
              ...collections,
              [params.page]: null,
            });
          }
        })
        .catch(() => {
          setCollections({
            ...collections,
            [params.page]: null,
          });
        });
    } else {
      setCollections(null);
      setLoadingCollections(false);
    }
  };

  useEffect(() => {
    setNavigationConfig({
      ...navigationConfig,
      totalItems: undefined,
    });

    if (!params.search) {
      return;
    }

    setCollections(null);
    setLoadingCollections(true);
    loadCollections();
  }, [params.search]);

  useEffect(() => {
    loadCollections();
  }, [params.page, params.orderBy]);

  /**
   * Navigation helper functions
   */
  const isFirstCollectionsPageForCurrentQuery = () => {
    return Number(params.page) === 1;
  };
  const isLastCollectionsPageForCurrentQuery = () => {
    if (navigationConfig.totalItems) {
      return (
        Number(params.page) !== 1 &&
        Number(params.page) * navigationConfig.itemsPerPage >
          navigationConfig.totalItems
      );
    } else return false;
  };

  const getNavigationPageTextGuide = () => {
    return navigationConfig.totalItems
      ? `${(Number(params.page) - 1) * navigationConfig.itemsPerPage + 1}-${Math.min(
          Number(params.page) * navigationConfig.itemsPerPage,
          navigationConfig.totalItems,
        )} of ${navigationConfig.totalItems} collections`
      : "No collections found";
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mx-auto py-8 w-full">
        <div className="max-w-7xl mx-auto p-6">
          <div>
            <h1 className="text-sm text-gray-500">
              Collection search results for
            </h1>
            <h2 className="text-3xl font-bold mb-5 leading-9 truncate">
              {params.search ? params.search : "______"}
            </h2>

            {/* Search Bar */}
            <div className="relative mb-10">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <DebounceInput
                id="query"
                type="text"
                name="query"
                autoComplete="off"
                value={params.search}
                debounceTimeout={300}
                placeholder="Type something"
                onChange={(e) => handleSearch(e.target.value)}
                className="focus:outline-none w-full text-sm bg-white border border-gray-300 rounded-md py-2 px-4 pl-9"
              />
              {params.search && (
                <Button
                  onClick={() => handleSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white hover:bg-transparent text-black shadow-none p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {params.search && (
              <>
                {loadingCollections && !collections?.[params.page] ? (
                  <CollectionsGridSkeleton />
                ) : collections ? (
                  <>
                    <div className="w-full flex flex-col xl:flex-row">
                      <div className="w-full">
                        {/* Collection Count and Sort */}
                        <div className="max-w-[756px] w-full flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-5">
                          <div className="flex items-center">
                            <div className="text-lg font-semibold mr-2.5">
                              {getNavigationPageTextGuide()}
                            </div>
                            {navigationConfig.totalItems ? (
                              <div className="flex">
                                <Button
                                  className="cursor-pointer p-[9px] bg-white shadow-none hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:hover:bg-white"
                                  disabled={isFirstCollectionsPageForCurrentQuery()}
                                  onClick={() =>
                                    handlePageChange(Number(params.page) - 1)
                                  }
                                >
                                  <ChevronLeft className="w-6 h-6 text-black" />
                                </Button>
                                <Button
                                  className="cursor-pointer p-[9px] bg-white shadow-none hover:bg-gray-50 rounded-lg disabled:opacity-50"
                                  disabled={isLastCollectionsPageForCurrentQuery()}
                                  onClick={() =>
                                    handlePageChange(Number(params.page) + 1)
                                  }
                                >
                                  <ChevronRight className="w-6 h-6 text-black" />
                                </Button>
                              </div>
                            ) : null}
                          </div>
                          {collections[params.page] ? (
                            <div className="flex space-x-3 items-center">
                              <div className="text-sm text-gray-500">
                                Sort by
                              </div>
                              <Select
                                defaultValue={
                                  params.orderBy || NameGraphSortOrderOptions.AI
                                }
                                onValueChange={(newValue) =>
                                  handleOrderBy(
                                    newValue as NameGraphSortOrderOptions,
                                  )
                                }
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(
                                    FromNameGraphSortOrderToDropdownTextContent,
                                  ).map(([key]) => {
                                    return (
                                      <SelectItem key={key} value={key}>
                                        {
                                          FromNameGraphSortOrderToDropdownTextContent[
                                            key as NameGraphSortOrderOptions
                                          ]
                                        }
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                          ) : null}
                        </div>
                        {/* Collections List */}
                        <div className="w-full max-w-[756px] space-y-4">
                          {loadingCollections ? (
                            <div className="flex flex-col space-y-7 my-8">
                              <CollectionsCardsSkeleton />
                            </div>
                          ) : collections[params.page] ? (
                            collections[params.page]?.related_collections.map(
                              (collection) => (
                                <Link
                                  key={collection.collection_id}
                                  href={`/collections/${collection.collection_id}`}
                                  className="!no-underline group cursor-pointer border border-l-0 border-r-0 border-b-0 pt-3 border-gray-200 flex items-start gap-[18px]"
                                >
                                  <div
                                    style={{
                                      border: "1px solid rgba(0, 0, 0, 0.05)",
                                    }}
                                    className="group-hover:bg-gray-300 group-hover:transition flex justify-center items-center rounded-md bg-background h-[72px] w-[72px] bg-gray-100"
                                  >
                                    <div className="relative flex items-center justify-center overflow-hidden">
                                      <p
                                        className={`text-3xl ${notoBlack.className}`}
                                      >
                                        {collection.avatar_emoji}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex-1 overflow-hidden">
                                    <h3 className="text-sm font-semibold">
                                      {collection.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-2 truncate">
                                      by {collection.owner}
                                    </p>
                                    <div className="relative">
                                      <div className="flex gap-2">
                                        {collection.top_names.map((tag) => (
                                          <span
                                            key={tag.namehash}
                                            className="bg-gray-100 text-sm px-2 py-1 bg-muted rounded-full"
                                          >
                                            {tag.name}
                                          </span>
                                        ))}
                                      </div>
                                      <div className="bg-gradient-white-to-transparent absolute right-0 top-0 w-40 h-full"></div>
                                    </div>
                                  </div>
                                </Link>
                              ),
                            )
                          ) : null}
                        </div>
                        {/* Pagination */}
                        {navigationConfig.totalItems ? (
                          <div className="flex items-center justify-between border border-gray-200 border-l-0 border-r-0 border-b-0 mt-3 pt-3">
                            <div className="text-sm text-gray-500 mr-2.5">
                              {getNavigationPageTextGuide()}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                className="bg-white text-black shadow-none hover:bg-gray-50 text-sm p-2.5"
                                disabled={isFirstCollectionsPageForCurrentQuery()}
                                onClick={() =>
                                  setNavigationConfig((prev) => ({
                                    ...prev,
                                    currentPage: Number(params.page) - 1,
                                  }))
                                }
                              >
                                <ChevronLeft />
                                Prev
                              </Button>
                              <Button
                                className="bg-white text-black shadow-none hover:bg-gray-50 text-sm p-2.5"
                                disabled={isLastCollectionsPageForCurrentQuery()}
                                onClick={() =>
                                  setNavigationConfig((prev) => ({
                                    ...prev,
                                    currentPage: Number(params.page) + 1,
                                  }))
                                }
                              >
                                Next
                                <ChevronRight />
                              </Button>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <div className="z-40 xl:max-w-[400px] mt-10 xl:mt-0 xl:ml-[68px] border rounded-md border-gray-200 w-full h-fit">
                        <h2 className="flex items-center text-lg font-semibold h-[47px] px-5 border border-t-0 border-r-0 border-l-0 border-gray-200">
                          Other collections
                        </h2>
                        {collections[params.page] ? (
                          collections[params.page]?.other_collections.map(
                            (collection) => (
                              <Link
                                key={collection.collection_id}
                                href={`/collections/${collection.collection_id}`}
                                className="!no-underline group rounded-lg cursor-pointer px-5 py-3 flex items-start gap-[18px]"
                              >
                                <div
                                  style={{
                                    border: "1px solid rgba(0, 0, 0, 0.05)",
                                  }}
                                  className="group-hover:bg-gray-300 group-hover:transition flex justify-center items-center rounded-md bg-background h-[72px] w-[72px] bg-gray-100"
                                >
                                  <div className="relative flex items-center justify-center overflow-hidden">
                                    <p
                                      className={`text-3xl ${notoBlack.className}`}
                                    >
                                      {collection.avatar_emoji}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                  <h3 className="text-sm font-semibold">
                                    {collection.title}
                                  </h3>
                                  <p className="text-xs text-gray-500 mb-2 truncate">
                                    by {collection.owner}
                                  </p>
                                  <div className="relative">
                                    <div className="flex gap-2">
                                      {collection.top_names.map((tag) => (
                                        <span
                                          key={tag.namehash}
                                          className="bg-gray-100 text-sm px-2 py-1 bg-muted rounded-full"
                                        >
                                          {tag.name}
                                        </span>
                                      ))}
                                    </div>
                                    <div className="bg-gradient-white-to-transparent absolute right-0 top-0 w-40 h-full"></div>
                                  </div>
                                </div>
                              </Link>
                            ),
                          )
                        ) : (
                          <div className="p-3 px-5">No collections found</div>
                        )}
                      </div>
                    </div>
                  </>
                ) : !loadCollections && !params.search && !collections ? (
                  <>Error</>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
