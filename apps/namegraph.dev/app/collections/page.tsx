"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import {
  NameGraphCollection,
  NameGraphSortOrderOptions,
} from "@namehash/namegraph-sdk/utils";
import {
  findCollectionsByMember,
  findCollectionsByString,
  FromNameGraphSortOrderToDropdownTextContent,
  getFirstLabelOfString,
  getNameDetailsPageHref,
} from "@/lib/utils";
import { DebounceInput } from "react-debounce-input";
import { Suspense, useEffect, useState } from "react";
import { Toggle } from "@/components/ui/toggle";
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
import { CollectionCard } from "@/components/collections/collection-card";
import { buildENSName } from "@namehash/ens-utils";
import { Link } from "@namehash/namekit-react";
import { NameWithCurrentTld } from "@/components/collections/name-with-current-tld";
import { DEFAULT_PAGE_NUMBER } from "@/components/collections/utils";
import { useQueryParams } from "@/components/use-query-params";

interface NavigationConfig {
  itemsPerPage: number;
  totalItems?: number;
}

interface CollectionsData {
  sort_order: NameGraphSortOrderOptions;
  other_collections: NameGraphCollection[] | null;
  related_collections: NameGraphCollection[];
}

export default function ExploreCollectionsPage() {
  /**
   * Table query
   */
  const { params, setParams } = useQueryParams();

  const handleSearch = (searchTerm: string) => {
    setNavigationConfig({
      ...navigationConfig,
      totalItems: undefined,
    });

    if (!searchTerm) {
      return;
    }

    setParams({
      ...params,
      collectionsSearch: {
        ...params.collectionsSearch,
        search: searchTerm,
        page: DEFAULT_PAGE_NUMBER, // Resets page when search changes
      },
    });

    setCollections(null);
    setLoadingCollections(true);

    queryCollections({
      search: params.collectionsSearch.search || "",
      orderBy: params.collectionsSearch.orderBy || NameGraphSortOrderOptions.AI,
      page: params.collectionsSearch.page || 1,
      exactMatch: params.collectionsSearch.exactMatch,
    });
  };

  const handleOrderBy = (orderBy: NameGraphSortOrderOptions) => {
    setParams({
      ...params,
      collectionsSearch: {
        ...params.collectionsSearch,
        orderBy,
      },
    });
    queryCollections({
      search: params.collectionsSearch.search || "",
      orderBy: orderBy || NameGraphSortOrderOptions.AI,
      page: params.collectionsSearch.page || 1,
      exactMatch: params.collectionsSearch.exactMatch,
    });
  };

  const handlePageChange = (page: number) => {
    setParams({
      ...params,
      collectionsSearch: {
        ...params.collectionsSearch,
        page: page,
      },
    });
    queryCollections({
      search: params.collectionsSearch.search || "",
      orderBy: params.collectionsSearch.orderBy || NameGraphSortOrderOptions.AI,
      page: page || 1,
      exactMatch: params.collectionsSearch.exactMatch,
    });
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
  const [lastQueryDone, setLastQueryDone] = useState<{
    search: string;
    exactMatch: boolean;
  }>({
    search: params.collectionsSearch.search || "",
    exactMatch: params.collectionsSearch.exactMatch,
  });

  const [loadingCollections, setLoadingCollections] = useState(true);

  const DEFAULT_ITEMS_PER_PAGE = 20;
  const [navigationConfig, setNavigationConfig] = useState<NavigationConfig>({
    itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    totalItems: undefined,
  });

  interface QueryCollectionsParam {
    exactMatch: boolean;
    orderBy: NameGraphSortOrderOptions;
    search: string;
    page: number;
  }

  const queryCollections = (payload: QueryCollectionsParam) => {
    if (payload.search) {
      const query = getFirstLabelOfString(payload.search);

      const MAX_COLLECTIONS_FOR_EXACT_MATCH = 10;
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
       * we do the queryCollections query once again and update the page's results.
       */
      if (
        !!lastQueryDone &&
        lastQueryDone.search === payload.search &&
        !!collections?.[payload.page] &&
        payload.orderBy == collections?.[payload.page]?.sort_order &&
        payload.exactMatch === lastQueryDone.exactMatch
      ) {
        return;
      }

      setLoadingCollections(true);

      if (payload.exactMatch) {
        findCollectionsByMember(query, {
          offset: (payload.page - 1) * navigationConfig.itemsPerPage,
          sort_order: payload.orderBy,
          limit_labels: MAX_COLLECTIONS_FOR_EXACT_MATCH,
          /**
           * Please note how the number of collections one page show is
           * strategically aligned with ITEMS_PER_PAGE_OPTIONS.
           */
          max_results: MAX_COLLECTIONS_FOR_EXACT_MATCH,
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

              const relatedCollections = res.collections;

              setCollections({
                ...collections,
                [payload.page]: {
                  sort_order: payload.orderBy,
                  related_collections: relatedCollections,
                  other_collections: null,
                },
              });
            } else {
              setCollections({
                ...collections,
                [payload.page]: null,
              });
            }
          })
          .catch(() => {
            setCollections({
              ...collections,
              [payload.page]: null,
            });
          })
          .finally(() => {
            setLoadingCollections(false);
          });
      } else {
        findCollectionsByString(query, {
          offset: (payload.page - 1) * navigationConfig.itemsPerPage,
          sort_order: payload.orderBy,
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
                [payload.page]: {
                  sort_order: payload.orderBy,
                  related_collections: relatedCollections,
                  other_collections: moreCollections,
                },
              });
            } else {
              setCollections({
                ...collections,
                [payload.page]: null,
              });
            }
          })
          .catch(() => {
            setCollections({
              ...collections,
              [payload.page]: null,
            });
          })
          .finally(() => {
            setLoadingCollections(false);
          });
      }

      setLastQueryDone({
        search: payload.search,
        exactMatch: payload.exactMatch,
      });
    } else {
      setCollections(null);
      setLoadingCollections(false);
    }
  };

  /**
   * Navigation helper functions
   */
  const isFirstCollectionsPageForCurrentQuery = () => {
    return Number(params.collectionsSearch.page) === 1;
  };
  const isLastCollectionsPageForCurrentQuery = () => {
    if (navigationConfig.totalItems) {
      return (
        Number(params.collectionsSearch.page) * navigationConfig.itemsPerPage >=
        navigationConfig.totalItems
      );
    } else return false;
  };

  const getNavigationPageTextGuide = () => {
    return navigationConfig.totalItems
      ? `${(Number(params.collectionsSearch.page) - 1) * navigationConfig.itemsPerPage + 1}-${Math.min(
          Number(params.collectionsSearch.page) * navigationConfig.itemsPerPage,
          navigationConfig.totalItems,
        )} of ${navigationConfig.totalItems} collections`
      : !loadingCollections
        ? "No collections found"
        : "";
  };

  useEffect(() => {
    handleSearch(params.collectionsSearch.search);
  }, [params.collectionsSearch.search]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mx-auto py-8 w-full">
        <div className="max-w-7xl mx-auto p-6">
          <div>
            <h1 className="text-sm text-gray-500">
              Collection search results for
            </h1>
            <div className="mt-1 mb-3">
              <Link
                href={getNameDetailsPageHref(
                  params.collectionsSearch.search.replace(" ", ""),
                )}
                className="!text-3xl font-bold mb-5 leading-9 truncate"
              >
                {params.collectionsSearch.search ? (
                  <NameWithCurrentTld name={params.collectionsSearch.search} />
                ) : (
                  "______"
                )}
              </Link>
            </div>

            {/* Search Bar */}
            <div className="relative mb-10">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <DebounceInput
                id="query"
                type="text"
                name="query"
                autoComplete="off"
                value={params.collectionsSearch.search}
                debounceTimeout={300}
                placeholder="Type something"
                onChange={(e) => handleSearch(e.target.value)}
                className="focus:outline-none w-full text-sm bg-white border border-gray-300 rounded-md py-2 px-4 pl-9"
              />
              {params.collectionsSearch.search && (
                <Button
                  onClick={() => handleSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white hover:bg-transparent text-black shadow-none p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {params.collectionsSearch.search && (
              <>
                {loadingCollections &&
                !collections?.[params.collectionsSearch.page] ? (
                  <CollectionsGridSkeleton />
                ) : collections ? (
                  <>
                    <div className="w-full flex flex-col xl:flex-row">
                      <div className="w-full">
                        {/* Collection Count and Sort */}
                        <div
                          className={`w-full flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-5 ${!collections[params.collectionsSearch.page]?.other_collections ? "" : "max-w-[756px]"}`}
                        >
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
                                    handlePageChange(
                                      Number(params.collectionsSearch.page) - 1,
                                    )
                                  }
                                >
                                  <ChevronLeft className="w-6 h-6 text-black" />
                                </Button>
                                <Button
                                  className="cursor-pointer p-[9px] bg-white shadow-none hover:bg-gray-50 rounded-lg disabled:opacity-50"
                                  disabled={isLastCollectionsPageForCurrentQuery()}
                                  onClick={() =>
                                    handlePageChange(
                                      Number(params.collectionsSearch.page) + 1,
                                    )
                                  }
                                >
                                  <ChevronRight className="w-6 h-6 text-black" />
                                </Button>
                              </div>
                            ) : null}
                          </div>

                          <div className="flex space-x-4">
                            {collections[params.collectionsSearch.page] ? (
                              <div className="flex text-gray-200 border rounded-lg">
                                <Toggle
                                  pressed={params.collectionsSearch.exactMatch}
                                  onPressedChange={(pressed) => {
                                    setNavigationConfig({
                                      ...navigationConfig,
                                      totalItems: undefined,
                                    });
                                    setParams({
                                      ...params,
                                      collectionsSearch: {
                                        ...params.collectionsSearch,
                                        exactMatch: pressed,
                                      },
                                    });
                                    queryCollections({
                                      search:
                                        params.collectionsSearch.search || "",
                                      orderBy:
                                        params.collectionsSearch.orderBy ||
                                        NameGraphSortOrderOptions.AI,
                                      page: params.collectionsSearch.page || 1,
                                      exactMatch: pressed,
                                    });
                                  }}
                                >
                                  Exact Match
                                </Toggle>
                              </div>
                            ) : null}
                            {collections[params.collectionsSearch.page] ? (
                              <div className="flex space-x-3 items-center">
                                <div className="text-sm text-gray-500">
                                  Sort by
                                </div>
                                <Select
                                  defaultValue={
                                    params.collectionsSearch.orderBy ||
                                    NameGraphSortOrderOptions.AI
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
                        </div>
                        {/* Collections List */}
                        <div
                          className={`w-full ${!collections[params.collectionsSearch.page]?.other_collections ? "" : "max-w-[756px]"}`}
                        >
                          {loadingCollections ? (
                            <div className="flex flex-col">
                              <CollectionsCardsSkeleton />
                            </div>
                          ) : collections[params.collectionsSearch.page] ? (
                            collections[
                              params.collectionsSearch.page
                            ]?.related_collections.map((collection) => (
                              <CollectionCard
                                key={collection.collection_id}
                                collection={collection}
                              />
                            ))
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
                                  handlePageChange(
                                    Number(params.collectionsSearch.page) - 1,
                                  )
                                }
                              >
                                <ChevronLeft />
                                Prev
                              </Button>
                              <Button
                                className="bg-white text-black shadow-none hover:bg-gray-50 text-sm p-2.5"
                                disabled={isLastCollectionsPageForCurrentQuery()}
                                onClick={() =>
                                  handlePageChange(
                                    Number(params.collectionsSearch.page) + 1,
                                  )
                                }
                              >
                                Next
                                <ChevronRight />
                              </Button>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      {collections[params.collectionsSearch.page]
                        ?.other_collections && (
                        <div className="z-40 xl:max-w-[400px] mt-10 xl:mt-0 xl:ml-[68px] border rounded-md border-gray-200 w-full h-fit">
                          <h2 className="flex items-center text-lg font-semibold h-[47px] px-5 border border-t-0 border-r-0 border-l-0 border-gray-200">
                            Other collections
                          </h2>
                          <div className="px-5">
                            {collections[
                              params.collectionsSearch.page
                            ]?.other_collections?.map((collection) => (
                              <CollectionCard
                                key={collection.collection_id}
                                collection={collection}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : !params.collectionsSearch.search && !collections ? (
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
