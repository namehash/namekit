"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import {
  NameGraphCollection,
  NameGraphFetchTopCollectionMembersResponse,
  NameGraphSortOrderOptions,
} from "@namehash/namegraph-sdk/utils";
import { useEffect, useState } from "react";
import Skeleton from "@/components/skeleton";
import { Button } from "@/components/ui/button";
import { useQueryParams } from "@/components/use-query-params";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { CollectionCard } from "@/components/collections/collection-card";
import {
  findCollectionsByMember,
  findCollectionsByString,
  FromNameGraphSortOrderToDropdownTextContent,
  getCollectionsForQuery,
} from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@namehash/namekit-react";
import { CollectionsCardsSkeleton } from "@/components/collections/collections-grid-skeleton";
import { AvatarSize, NftAvatar } from "@namehash/namekit-react/client";
import { Normalization } from "@namehash/ens-utils";
import { NameWithDefaultSuffix } from "@/components/collections/name-with-default-suffix";

interface NavigationConfig {
  itemsPerPage: number;
  totalItems?: Record<NameRelatedCollectionsTabs, number | undefined>;
}

interface CollectionsData {
  sort_order: NameGraphSortOrderOptions;
  related_collections: NameGraphCollection[];
}

const NameRelatedCollectionsTabs = {
  ByMembership: "ByMembership",
  ByConcept: "ByConcept",
} as const;

type NameRelatedCollectionsTabs =
  (typeof NameRelatedCollectionsTabs)[keyof typeof NameRelatedCollectionsTabs];

export const NameDetailsPage = ({ name }: { name: string }) => {
  const DEFAULT_SORTING_ORDER = NameGraphSortOrderOptions.RELEVANCE;
  const DEFAULT_ACTIVE_TAB = NameRelatedCollectionsTabs.ByConcept;

  const [loadingCollectionsByMembership, setLoadingCollectionsByMembership] =
    useState(true);
  const [loadingCollectionByConcept, setLoadingCollectionByConcept] =
    useState(true);

  /**
   * undefined: when query was never done
   * null: when query was done but resulted in error
   * NameGraphFindCollectionsResponse: when query was successfully done
   */
  const [relatedCollectionsByMembership, setRelatedCollectionsByMembership] =
    useState<
      undefined | null | Record<number, CollectionsData | null | undefined>
    >(undefined);

  /**
   * undefined: when query was never done
   * null: when query was done but resulted in error
   * NameGraphFindCollectionsResponse: when query was successfully done
   */
  const [relatedCollectionsByConcept, setRelatedCollectionsByConcept] =
    useState<
      undefined | null | Record<number, CollectionsData | null | undefined>
    >(undefined);

  const [otherCategories, setOtherCategories] = useState<
    NameGraphFetchTopCollectionMembersResponse[] | undefined
  >(undefined);

  interface QueryNameRelatedCollectionsParams {
    activeTab: NameRelatedCollectionsTabs;
    orderBy?: NameGraphSortOrderOptions;
    page: number;
  }

  const queryCollections = (params: QueryNameRelatedCollectionsParams) => {
    if (name) {
      let query = name;
      if (name.includes(".")) {
        query = name.split(".")[0];
      }

      const MAX_COLLECTIONS_FOR_EXACT_MATCH = 10;
      const MAX_RELATED_COLLECTIONS = 20;
      const OTHER_COLLECTIONS_NUMBER = 5;

      /**
       * This is the case where we have already queried the results for
       * a given page, which is being visited once again and for which
       * we have already stored its necessary data.
       *
       * There is no need then to re-do a load collections query.
       *
       * Of course this is only true if both the query and the sorting
       * algorithm lastly used are the same. If any of these have changes,
       * we do the queryCollections query once again and update the page's results.
       */

      let currentCollectionsToConsider = relatedCollectionsByMembership;
      if (params.activeTab === DEFAULT_ACTIVE_TAB) {
        currentCollectionsToConsider = relatedCollectionsByConcept;
      }

      const currentPageWasLoaded =
        !!currentCollectionsToConsider?.[params.page] &&
        params.orderBy ==
          currentCollectionsToConsider?.[params.page]?.sort_order;

      if (currentPageWasLoaded) {
        return;
      }

      if (params.activeTab === NameRelatedCollectionsTabs.ByMembership) {
        setLoadingCollectionsByMembership(true);
        findCollectionsByMember(query, {
          offset: (params.page - 1) * navigationConfig.itemsPerPage,
          sort_order: params.orderBy,
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
                totalItems: {
                  [NameRelatedCollectionsTabs.ByConcept]:
                    navigationConfig.totalItems?.[
                      NameRelatedCollectionsTabs.ByConcept
                    ],
                  [NameRelatedCollectionsTabs.ByMembership]:
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
                },
              });

              const relatedCollections = res.collections;

              if (relatedCollections.length === 0) {
                setRelatedCollectionsByMembership(null);
                return;
              }

              setRelatedCollectionsByMembership({
                ...relatedCollectionsByMembership,
                [params.page]: {
                  sort_order: params.orderBy || DEFAULT_SORTING_ORDER,
                  related_collections: relatedCollections,
                },
              });
            } else {
              setRelatedCollectionsByMembership({
                ...relatedCollectionsByMembership,
                [params.page]: null,
              });
            }
          })
          .catch(() => {
            setRelatedCollectionsByMembership({
              ...relatedCollectionsByMembership,
              [params.page]: null,
            });
          })
          .finally(() => {
            setLoadingCollectionsByMembership(false);
          });
      } else {
        setLoadingCollectionByConcept(true);
        findCollectionsByString(query, {
          offset: (params.page - 1) * navigationConfig.itemsPerPage,
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
                totalItems: {
                  [NameRelatedCollectionsTabs.ByMembership]:
                    navigationConfig.totalItems?.[
                      NameRelatedCollectionsTabs.ByMembership
                    ],
                  [NameRelatedCollectionsTabs.ByConcept]:
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
                },
              });

              const relatedCollections = res.related_collections;

              if (relatedCollections.length === 0) {
                setRelatedCollectionsByConcept(null);
                return;
              }

              setRelatedCollectionsByConcept({
                ...relatedCollectionsByConcept,
                [params.page]: {
                  sort_order: params.orderBy || DEFAULT_SORTING_ORDER,
                  related_collections: relatedCollections,
                },
              });
            } else {
              setRelatedCollectionsByConcept({
                ...relatedCollectionsByConcept,
                [params.page]: null,
              });
            }
          })
          .catch(() => {
            setRelatedCollectionsByConcept({
              ...relatedCollectionsByConcept,
              [params.page]: null,
            });
          })
          .finally(() => {
            setLoadingCollectionByConcept(false);
          });
      }
    }
  };

  /**
   * Table query
   */
  const DEFAULT_PAGE_NUMBER = 1;
  const DEFAULT_COLLECTIONS_PARAMS: Record<string, any> = {
    page: {
      [NameRelatedCollectionsTabs.ByConcept]: DEFAULT_PAGE_NUMBER,
      [NameRelatedCollectionsTabs.ByMembership]: DEFAULT_PAGE_NUMBER,
    },
    activeTab: DEFAULT_ACTIVE_TAB,
    orderBy: DEFAULT_SORTING_ORDER,
  };
  type DefaultDomainFiltersType = typeof DEFAULT_COLLECTIONS_PARAMS;
  const { params, setParams } = useQueryParams<DefaultDomainFiltersType>(
    DEFAULT_COLLECTIONS_PARAMS,
  );

  const handlePageChange = (page: number) => {
    setParams({
      page: {
        ...params.page,
        [(params.activeTab as NameRelatedCollectionsTabs) ||
        DEFAULT_ACTIVE_TAB]: page,
      },
    });

    queryCollections({
      page: page || DEFAULT_PAGE_NUMBER,
      activeTab: params.activeTab || DEFAULT_ACTIVE_TAB,
    });
  };

  const handleActiveTabChange = (activeTab: NameRelatedCollectionsTabs) => {
    setParams({ activeTab });
  };

  useEffect(() => {
    queryCollections({
      page:
        params.page[params.activeTab || DEFAULT_ACTIVE_TAB] ||
        DEFAULT_PAGE_NUMBER,
      activeTab: params.activeTab,
    });
  }, [params.activeTab]);

  /**
   * Navigation helper functions
   */
  const DEFAULT_ITEMS_PER_PAGE = 20;
  const [navigationConfig, setNavigationConfig] = useState<NavigationConfig>({
    itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    totalItems: {
      [NameRelatedCollectionsTabs.ByConcept]: undefined,
      [NameRelatedCollectionsTabs.ByMembership]: undefined,
    },
  });

  useEffect(() => {
    const activeTab = params.activeTab || DEFAULT_ACTIVE_TAB;

    if (
      /**
       * If the results of both tabs are already
       * loaded, we load the other categories results
       */
      navigationConfig.totalItems &&
      navigationConfig.totalItems[NameRelatedCollectionsTabs.ByConcept] &&
      navigationConfig.totalItems[NameRelatedCollectionsTabs.ByMembership]
    ) {
      getCollectionsForQuery(name, true)
        .then((res) => {
          console.log(res, res.categories);
          setOtherCategories(res.categories);
        })
        .catch((err) => {
          console.error(err);
          setOtherCategories([]);
        });
    } else if (
      /**
       * If the main results are already loaded
       * we load the results for the hidden tab
       */
      navigationConfig.totalItems &&
      navigationConfig.totalItems[activeTab as NameRelatedCollectionsTabs]
    ) {
      queryCollections({
        activeTab: getOppositeTab(),
        page:
          params.page[params.activeTab || DEFAULT_ACTIVE_TAB] ||
          DEFAULT_PAGE_NUMBER,
        orderBy: params.orderBy,
      });
    }
  }, [navigationConfig?.totalItems]);

  const isFirstCollectionsPageForCurrentQuery = () => {
    return Number(params.page[params.activeTab || DEFAULT_ACTIVE_TAB]) === 1;
  };
  const isLastCollectionsPageForCurrentQuery = () => {
    if (navigationConfig.totalItems) {
      let totalItems = navigationConfig.totalItems.ByConcept;
      if (params.activeTab === NameRelatedCollectionsTabs.ByMembership) {
        totalItems = navigationConfig.totalItems.ByMembership;
      }

      if (totalItems) {
        return (
          Number(params.page[params.activeTab || DEFAULT_ACTIVE_TAB]) *
            navigationConfig.itemsPerPage >=
          totalItems
        );
      }
    } else return false;
  };

  const getNavigationPageTextGuide = () => {
    if (navigationConfig.totalItems) {
      let totalItems = navigationConfig.totalItems.ByConcept;
      if (params.activeTab === NameRelatedCollectionsTabs.ByMembership) {
        totalItems = navigationConfig.totalItems.ByMembership;
      }

      if (totalItems) {
        return `${(Number(params.page[params.activeTab || DEFAULT_ACTIVE_TAB]) - 1) * navigationConfig.itemsPerPage + 1}-${Math.min(
          Number(params.page[params.activeTab || DEFAULT_ACTIVE_TAB]) *
            navigationConfig.itemsPerPage,
          totalItems,
        )} of ${totalItems} name suggestions`;
      }
    } else {
      return "No name suggestions found";
    }
  };

  const FromTabNameToTabLabel = {
    [NameRelatedCollectionsTabs.ByConcept]: "By concept",
    [NameRelatedCollectionsTabs.ByMembership]: "By membership",
  };

  /**
   * This serves for us to query results in a wise manner:
   * We first query results for visible tab and later on for
   * hidden tab. This is necessary as we want to show the count
   * of results of both tabs as soon as possible. This is also wise
   * as we prioritize, always, querying first the results that will be
   * displayed in visitor's UI and later on the results that he/she can visit.
   */
  const getOppositeTab = (): NameRelatedCollectionsTabs => {
    const activeTab = params.activeTab || DEFAULT_ACTIVE_TAB;

    switch (activeTab) {
      case NameRelatedCollectionsTabs.ByConcept:
        return NameRelatedCollectionsTabs.ByMembership;
      case NameRelatedCollectionsTabs.ByMembership:
        return NameRelatedCollectionsTabs.ByConcept;
      default:
        return NameRelatedCollectionsTabs.ByMembership;
    }
  };

  const handleOrderBy = (orderBy: NameGraphSortOrderOptions) => {
    setParams({ orderBy });
    queryCollections({
      activeTab: params.activeTab || DEFAULT_ACTIVE_TAB,
      page:
        params.page[params.activeTab || DEFAULT_ACTIVE_TAB] ||
        DEFAULT_PAGE_NUMBER,
      orderBy,
    });
  };

  return (
    <div className="mx-auto py-8 w-full">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex space-x-4 mb-8">
          <div>
            <div className="text-3xl font-semibold mb-4">
              {name ? (
                <NameWithDefaultSuffix name={name} />
              ) : (
                <Skeleton className="w-40 h-8" />
              )}
            </div>
          </div>
        </div>
        <NftAvatar
          name={{
            namehash: "",
            slug: "vitalik.eth",
            displayName: "vitalik.eth",
            normalizedName: Normalization.Normalized,
            labelName: "",
            labelHash: "",
            unwrappedTokenId: BigInt(0),
            wrappedTokenId: BigInt(0),
          }}
          domainCard={{
            name,
          }}
          withLink={false}
          size={AvatarSize.SMALL}
        />
        <div className="flex space-x-4">
          <div className="w-full">
            {/* Collections List */}
            <div className="w-full space-y-4">
              <Tabs defaultValue={params.activeTab || DEFAULT_ACTIVE_TAB}>
                <div className="flex justify-between flex-col space-y-4 md:space-y-0 md:flex-row">
                  <TabsList className="w-max">
                    {Object.entries(NameRelatedCollectionsTabs).map(
                      ([key, value]) => {
                        return (
                          <TabsTrigger
                            key={value}
                            value={key as NameRelatedCollectionsTabs}
                            onClick={() =>
                              handleActiveTabChange(
                                key as NameRelatedCollectionsTabs,
                              )
                            }
                          >
                            {
                              FromTabNameToTabLabel[
                                key as NameRelatedCollectionsTabs
                              ]
                            }
                            {navigationConfig.totalItems?.[
                              key as NameRelatedCollectionsTabs
                            ] !== undefined ? (
                              <span className="w-16 ml-3 border border-gray-400 rounded-full">
                                {
                                  navigationConfig.totalItems?.[
                                    key as NameRelatedCollectionsTabs
                                  ]
                                }
                              </span>
                            ) : (
                              <Skeleton className="ml-3 w-16 h-6" />
                            )}
                          </TabsTrigger>
                        );
                      },
                    )}
                  </TabsList>
                  <Select
                    defaultValue={
                      params.orderBy || NameGraphSortOrderOptions.AI
                    }
                    onValueChange={(newValue) =>
                      handleOrderBy(newValue as NameGraphSortOrderOptions)
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
                {Object.entries(NameRelatedCollectionsTabs).map(
                  ([key, value]) => {
                    return (
                      <TabsContent
                        key={value}
                        className="w-full"
                        value={key as NameRelatedCollectionsTabs}
                      >
                        <div className="min-h-[400px] overflow-hidden">
                          {key === NameRelatedCollectionsTabs.ByConcept ? (
                            <>
                              {loadingCollectionByConcept ? (
                                <div className="w-full flex flex-col justify-center items-center">
                                  <div className="w-full flex flex-col space-y-4 p-3 rounded-xl mb-8 border border-gray-200">
                                    <Skeleton className="w-[350px] my-2 h-6 mr-auto" />
                                    <CollectionsCardsSkeleton className="flex flex-col space-y-[30px]" />
                                    <CollectionsCardsSkeleton />
                                  </div>
                                </div>
                              ) : relatedCollectionsByConcept ? (
                                <div>
                                  <div className="w-full flex flex-col xl:flex-row space-y-8 xl:space-x-8 xl:space-y-0">
                                    <div className="w-full">
                                      <div className="w-full mb-8">
                                        <div className="w-full flex flex-col space-y-4 p-3 rounded-xl border border-gray-200">
                                          <div className="w-full flex flex-col justify-start">
                                            <div className="h-full">
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
                                                          handlePageChange(
                                                            Number(
                                                              params.page[
                                                                params.activeTab ||
                                                                  DEFAULT_ACTIVE_TAB
                                                              ],
                                                            ) - 1,
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
                                                            Number(
                                                              params.page[
                                                                params.activeTab ||
                                                                  DEFAULT_ACTIVE_TAB
                                                              ],
                                                            ) + 1,
                                                          )
                                                        }
                                                      >
                                                        <ChevronRight className="w-6 h-6 text-black" />
                                                      </Button>
                                                    </div>
                                                  ) : null}
                                                </div>
                                              </div>
                                              {/* Collections List */}
                                              <div className="w-full h-full max-w-[756px] space-y-4">
                                                {loadingCollectionByConcept ? (
                                                  <div className="my-20 flex flex-col w-full mt-auto justify-center items-center">
                                                    <CollectionsCardsSkeleton />
                                                  </div>
                                                ) : relatedCollectionsByConcept[
                                                    params.page[
                                                      params.activeTab ||
                                                        DEFAULT_ACTIVE_TAB
                                                    ]
                                                  ] ? (
                                                  relatedCollectionsByConcept[
                                                    params.page[
                                                      params.activeTab ||
                                                        DEFAULT_ACTIVE_TAB
                                                    ]
                                                  ]?.related_collections.map(
                                                    (collection) => (
                                                      <CollectionCard
                                                        key={
                                                          collection.collection_id
                                                        }
                                                        collection={collection}
                                                      />
                                                    ),
                                                  )
                                                ) : null}
                                              </div>
                                            </div>
                                            <div className="mt-auto">
                                              {/* Pagination */}
                                              {navigationConfig.totalItems ? (
                                                <div className="flex items-center justify-between border border-gray-200 border-l-0 border-r-0 border-b-0 mt-3 p-3">
                                                  <div className="text-sm text-gray-500 mr-2.5">
                                                    {getNavigationPageTextGuide()}
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <Button
                                                      className="bg-white text-black shadow-none hover:bg-gray-50 text-sm p-2.5"
                                                      disabled={isFirstCollectionsPageForCurrentQuery()}
                                                      onClick={() =>
                                                        handlePageChange(
                                                          Number(
                                                            params.page[
                                                              params.activeTab ||
                                                                DEFAULT_ACTIVE_TAB
                                                            ],
                                                          ) - 1,
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
                                                          Number(
                                                            params.page[
                                                              params.activeTab ||
                                                                DEFAULT_ACTIVE_TAB
                                                            ],
                                                          ) + 1,
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
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : null}
                            </>
                          ) : (
                            <>
                              {loadingCollectionsByMembership ? (
                                <div className="w-full flex flex-col justify-center items-center">
                                  <div className="w-full flex flex-col space-y-4 p-3 rounded-xl mb-8 border border-gray-200">
                                    <Skeleton className="w-[350px] my-2 h-6 mr-auto" />
                                    <CollectionsCardsSkeleton className="flex flex-col space-y-[30px]" />
                                    <CollectionsCardsSkeleton />
                                  </div>
                                </div>
                              ) : relatedCollectionsByMembership ? (
                                <div>
                                  <div className="w-full flex flex-col xl:flex-row space-y-8 xl:space-x-8 xl:space-y-0">
                                    <div className="w-full">
                                      <div className="w-full mb-8">
                                        <div className="w-full flex flex-col space-y-4 p-3 rounded-xl border border-gray-200">
                                          <div className="w-full flex flex-col justify-start">
                                            <div className="h-full">
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
                                                          handlePageChange(
                                                            Number(
                                                              params.page[
                                                                params.activeTab ||
                                                                  DEFAULT_ACTIVE_TAB
                                                              ],
                                                            ) - 1,
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
                                                            Number(
                                                              params.page[
                                                                params.activeTab ||
                                                                  DEFAULT_ACTIVE_TAB
                                                              ],
                                                            ) + 1,
                                                          )
                                                        }
                                                      >
                                                        <ChevronRight className="w-6 h-6 text-black" />
                                                      </Button>
                                                    </div>
                                                  ) : null}
                                                </div>
                                              </div>
                                              {/* Collections List */}
                                              <div className="w-full h-full max-w-[756px] space-y-4">
                                                {loadingCollectionsByMembership ? (
                                                  <div className="flex flex-col w-full mt-auto justify-center items-center">
                                                    <CollectionsCardsSkeleton />
                                                  </div>
                                                ) : relatedCollectionsByMembership[
                                                    params.page[
                                                      params.activeTab ||
                                                        DEFAULT_ACTIVE_TAB
                                                    ]
                                                  ] ? (
                                                  relatedCollectionsByMembership[
                                                    params.page[
                                                      params.activeTab ||
                                                        DEFAULT_ACTIVE_TAB
                                                    ]
                                                  ]?.related_collections.map(
                                                    (collection) => (
                                                      <CollectionCard
                                                        key={
                                                          collection.collection_id
                                                        }
                                                        collection={collection}
                                                      />
                                                    ),
                                                  )
                                                ) : null}
                                              </div>
                                            </div>
                                            <div className="mt-auto">
                                              {/* Pagination */}
                                              {navigationConfig.totalItems ? (
                                                <div className="flex items-center justify-between border border-gray-200 border-l-0 border-r-0 border-b-0 mt-3 p-3">
                                                  <div className="text-sm text-gray-500 mr-2.5">
                                                    {getNavigationPageTextGuide()}
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <Button
                                                      className="bg-white text-black shadow-none hover:bg-gray-50 text-sm p-2.5"
                                                      disabled={isFirstCollectionsPageForCurrentQuery()}
                                                      onClick={() =>
                                                        handlePageChange(
                                                          Number(
                                                            params.page[
                                                              params.activeTab ||
                                                                DEFAULT_ACTIVE_TAB
                                                            ],
                                                          ) - 1,
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
                                                          Number(
                                                            params.page[
                                                              params.activeTab ||
                                                                DEFAULT_ACTIVE_TAB
                                                            ],
                                                          ) + 1,
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
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <p className="mt-8 text-sm ml-2">
                                  No related collections where found for this
                                  name
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </TabsContent>
                    );
                  },
                )}
              </Tabs>
            </div>
            <div className="flex flex-col space-y-2"></div>
          </div>
        </div>
      </div>
      {otherCategories?.length ? (
        <div className="max-w-7xl mx-auto p-6">
          <div className="w-full rounded-lg border border-gray-200">
            <p className="text-[18px] font-semibold px-5 py-2.5 border-b border-gray-200">
              Explore other names
            </p>
            {otherCategories.map((collection) => {
              return (
                <div key={collection.collection_id}>
                  <p className="py-3 px-5 font-semibold text-sm text-gray-500">
                    {collection.name}
                  </p>
                  <div className="flex flex-col">
                    {collection.suggestions.slice(0, 3).map((suggestion) => {
                      return (
                        <Link
                          key={suggestion.label}
                          href={`/name/${suggestion.label}`}
                          className="p-5 border-t border-gray-200 font-semibold text-base text-black"
                        >
                          <NameWithDefaultSuffix name={suggestion.label} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};
