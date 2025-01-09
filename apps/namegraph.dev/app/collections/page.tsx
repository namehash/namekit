"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import { NameGraphCollection } from "@namehash/namegraph-sdk/utils";
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

const notoBlack = Noto_Emoji({ preload: false });

interface NavigationConfig {
  itemsPerPage: number;
  totalItems?: number;
}

export default function ExploreCollectionsPage() {
  /**
   * Table query
   */
  enum ResultsOrderBy {
    AiMatch = "AI match",
    MostRecent = "Most recent",
    MorePopular = "More popular",
  }
  const DEFAULT_COLLECTIONS_PARAMS: Record<string, any> = {
    search: "",
    page: 1,
    orderBy: Object.keys(ResultsOrderBy)[0],
  };
  type DefaultDomainFiltersType = typeof DEFAULT_COLLECTIONS_PARAMS;
  const { params, setParams } = useQueryParams<DefaultDomainFiltersType>(
    DEFAULT_COLLECTIONS_PARAMS,
  );

  const handleSearch = (searchTerm: string) => {
    setParams({
      search: searchTerm,
      page: 1, // Resets page when search changes
    });
  };

  const handleOrderBy = (orderBy: string) => {
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
    undefined | null | NameGraphCollection[]
  >(undefined);
  /**
   * collectionsToDisplay state:
   *
   * undefined is set when component never tried querying collections
   * null is set when no collections were retrieved from NameGraph SDK for currentSearch
   * NameGraphCollection[] is set when collections that were retrieved were grouped and state was set
   *
   * This array reserves the collections sliced by the current page considering navigationConfig.itemsPerPage
   */
  const [collectionsToDisplay, setCollectionsToDisplay] = useState<
    undefined | null | NameGraphCollection[]
  >(undefined);

  /**
   * other collections state:
   *
   * undefined is set when component never tried querying other collections
   * null is set when no other collections were retrieved from NameGraph SDK for currentSearch
   * NameGraphCollection[] is set when other collections that were retrieved were grouped and state was set
   */
  const [otherCollections, setOtherCollections] = useState<
    undefined | null | NameGraphCollection[]
  >(undefined);

  const [loadingCollections, setLoadingCollections] = useState(true);

  const [navigationConfig, setNavigationConfig] = useState<NavigationConfig>({
    itemsPerPage: 20,
    totalItems: undefined,
  });

  const loadCollections = (forNewQuery = false) => {
    if (params.search) {
      let query = params.search;
      if (params.search.includes(".")) {
        query = params.search.split(".")[0];
      }

      /**
       * Paginate over collections based on current page.
       * NameGraph SDK pagination start from 0.
       */
      let offset = forNewQuery ? 0 : Number(params.page) - 1;
      let amountOfPagesCurrentResultsFill = 0;
      if (collections && !forNewQuery) {
        const numberOfResultsBeingShownPerPage = navigationConfig.itemsPerPage;
        const totalResultsWeHaveQueried = collections.length;
        amountOfPagesCurrentResultsFill =
          totalResultsWeHaveQueried / numberOfResultsBeingShownPerPage;
      }

      if (offset + 1 > amountOfPagesCurrentResultsFill) {
        setLoadingCollections(true);
        findCollectionsByString(query, {
          offset,
          max_total_collections: 25,
          /**
           * Please note how the number of collections one page show is
           * strategically aligned with ITEMS_PER_PAGE_OPTIONS.
           */
          max_related_collections: 20,
          max_other_collections: 5,
          min_other_collections: 5,
        })
          .then((res) => {
            if (res) {
              setNavigationConfig({
                ...navigationConfig,
                totalItems:
                  typeof res.metadata.total_number_of_matched_collections ===
                  "number"
                    ? res.metadata.total_number_of_matched_collections
                    : 1000,
              });

              const moreCollections = res.other_collections;
              const relatedCollections = res.related_collections;

              /**
               * Below logic aggrupates results if query is the same
               * and user is navigation over multiple pages of this
               * same query. We do so to not have to load the results
               * once loaded again, if uses comes back to the pages
               * already visited. If query is new, only the new queried
               * collections are stored, no past collections are grouped.
               */
              const collectionsArray = forNewQuery
                ? relatedCollections
                : [...(collections ? collections : []), ...relatedCollections];

              const otherCollectionsArray = forNewQuery
                ? moreCollections
                : [
                    ...(otherCollections ? otherCollections : []),
                    ...moreCollections,
                  ];

              setCollections(collectionsArray);
              setOtherCollections(otherCollectionsArray);
              setLoadingCollections(false);
            } else {
              setCollections(undefined);
            }
          })
          .catch(() => {
            setCollections(null);
            setOtherCollections(null);
          });
      }
    } else {
      setCollections(null);
      setLoadingCollections(false);
    }
  };

  const sliceCollectionsList = () => {
    if (collections) {
      setCollectionsToDisplay(
        collections
          /**
           * In short, the sliced piece is getting a number of collections
           * from all collection results. This piece gets the current piece
           * to display (X number of collections) based on ITEMS_PER_PAGE_OPTIONS
           * chose by the user.
           */
          ?.slice(
            Number(params.page) * navigationConfig.itemsPerPage -
              navigationConfig.itemsPerPage,
            Number(params.page) * navigationConfig.itemsPerPage,
          ),
      );
    } else {
      setCollectionsToDisplay(null);
    }
  };

  useEffect(() => {
    sliceCollectionsList();
  }, [collections, params.page]);

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
    loadCollections(true);
  }, [params.search]);

  useEffect(() => {
    /**
     * This makes the load of collections only be done here for
     * queries that are being navigated throught, which means,
     * for queries where user is navigating to page 2, 3, 4
     * or so on. For page 1 queries the load of results
     * is being done right above this useEffect block
     */
    if (Number(params.page) !== DEFAULT_COLLECTIONS_PARAMS.page)
      loadCollections();
  }, [params.page]);

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
                {loadingCollections && !collections ? (
                  <CollectionsGridSkeleton />
                ) : collectionsToDisplay ? (
                  <>
                    <div className="w-full flex flex-col xl:flex-row">
                      <div className="w-full">
                        {/* Collection Count and Sort */}
                        <div className="max-w-[756px] w-full flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-5">
                          <div className="flex items-center">
                            <div className="text-lg font-semibold mr-2.5">
                              {navigationConfig.totalItems
                                ? `${(Number(params.page) - 1) * navigationConfig.itemsPerPage + 1}-${Math.min(
                                    Number(params.page) *
                                      navigationConfig.itemsPerPage,
                                    navigationConfig.totalItems,
                                  )} of ${navigationConfig.totalItems} collections`
                                : "No collections found"}
                            </div>
                            {navigationConfig.totalItems ? (
                              <div className="flex">
                                <Button
                                  className="cursor-pointer p-[9px] bg-white shadow-none hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:hover:bg-white"
                                  disabled={Number(params.page) === 1}
                                  onClick={() =>
                                    handlePageChange(Number(params.page) - 1)
                                  }
                                >
                                  <ChevronLeft className="w-6 h-6 text-black" />
                                </Button>
                                <Button
                                  className="cursor-pointer p-[9px] bg-white shadow-none hover:bg-gray-50 rounded-lg disabled:opacity-50"
                                  disabled={
                                    Number(params.page) !== 1 &&
                                    Number(params.page) *
                                      navigationConfig.itemsPerPage >
                                      navigationConfig.totalItems
                                  }
                                  onClick={() =>
                                    handlePageChange(Number(params.page) + 1)
                                  }
                                >
                                  <ChevronRight className="w-6 h-6 text-black" />
                                </Button>
                              </div>
                            ) : null}
                          </div>
                          {collections?.length ? (
                            <div className="flex space-x-3 items-center">
                              <div className="text-sm text-gray-500">
                                Sort by
                              </div>
                              <Select
                                defaultValue={Object.keys(ResultsOrderBy)[0]}
                                onValueChange={(newValue) =>
                                  handleOrderBy(newValue as ResultsOrderBy)
                                }
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(ResultsOrderBy).map(
                                    ([key, value]) => {
                                      return (
                                        <SelectItem key={key} value={key}>
                                          {value}
                                        </SelectItem>
                                      );
                                    },
                                  )}
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
                          ) : (
                            collectionsToDisplay.map((collection) => (
                              <div
                                key={collection.collection_id}
                                className="border border-l-0 border-r-0 border-b-0 pt-3 border-gray-200 flex items-start gap-[18px]"
                              >
                                <div
                                  style={{
                                    border: "1px solid rgba(0, 0, 0, 0.05)",
                                  }}
                                  className="flex justify-center items-center rounded-md bg-background h-[72px] w-[72px] bg-gray-100"
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
                              </div>
                            ))
                          )}
                        </div>
                        {/* Pagination */}
                        {navigationConfig.totalItems ? (
                          <div className="flex items-center justify-between border border-gray-200 border-l-0 border-r-0 border-b-0 mt-3 pt-3">
                            <div className="text-sm text-gray-500 mr-2.5">
                              {navigationConfig.totalItems
                                ? `${(Number(params.page) - 1) * navigationConfig.itemsPerPage + 1}-${Math.min(
                                    Number(params.page) *
                                      navigationConfig.itemsPerPage,
                                    navigationConfig.totalItems,
                                  )} of ${navigationConfig.totalItems} collections`
                                : "No collections found"}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                className="bg-white text-black shadow-none hover:bg-gray-50 text-sm p-2.5"
                                disabled={Number(params.page) === 1}
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
                                disabled={
                                  Number(params.page) !== 1 &&
                                  Number(params.page) *
                                    navigationConfig.itemsPerPage >
                                    navigationConfig.totalItems
                                }
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
                        {otherCollections ? (
                          otherCollections.map((collection) => (
                            <div
                              key={collection.collection_id}
                              className="px-5 py-3 flex items-start gap-[18px]"
                            >
                              <div
                                style={{
                                  border: "1px solid rgba(0, 0, 0, 0.05)",
                                }}
                                className="flex justify-center items-center rounded-md bg-background h-[72px] w-[72px] bg-gray-100"
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
                            </div>
                          ))
                        ) : (
                          <div>No collections found</div>
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
