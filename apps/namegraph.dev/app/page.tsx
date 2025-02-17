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
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  CollectionsCardsSkeleton,
  CollectionsGridSkeleton,
} from "@/components/collections/collections-grid-skeleton";
import { CollectionCard } from "@/components/collections/collection-card";
import { buildENSName, ENSName } from "@namehash/ens-utils";
import { Link } from "@namehash/namekit-react";
import { DEFAULT_PAGE_NUMBER } from "@/components/collections/utils";
import {
  NameWithCurrentTld,
  QueryParams,
  useQueryParams,
} from "@/components/use-query-params";
import { HomePage } from "@/components/homepage/homepage";
import { NftAvatar } from "@/components/nft-avatar/nft-avatar";
import { AvatarSize } from "@/components/nft-avatar/avatar-utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DEFAULT_ACTIVE_TAB,
  DEFAULT_ITEMS_PER_PAGE,
  NameRelatedCollectionsTabs,
} from "./name/[name]/types";
import Skeleton from "@/components/skeleton";
import { DEFAULT_SORTING_ORDER } from "@/components/providers";

interface NavigationConfig {
  itemsPerPage: number;
  totalItems?: Record<NameRelatedCollectionsTabs, number | undefined>;
}

interface CollectionsData {
  sort_order: NameGraphSortOrderOptions;
  related_collections: NameGraphCollection[];
}

export default function ExploreCollectionsPage() {
  const { params, setParams } = useQueryParams();

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

  interface QueryCollectionsParam {
    tab: NameRelatedCollectionsTabs;
    orderBy?: NameGraphSortOrderOptions;
    search: string;
    page: number;
  }

  const queryCollections = (payload: QueryCollectionsParam) => {
    if (payload.search) {
      const query = getFirstLabelOfString(payload.search);

      const MAX_COLLECTIONS_FOR_EXACT_MATCH = 20;
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
      if (payload.tab === DEFAULT_ACTIVE_TAB) {
        currentCollectionsToConsider = relatedCollectionsByConcept;
      }

      const currentPageWasLoaded =
        !!currentCollectionsToConsider?.[payload.page] &&
        payload.orderBy ==
          currentCollectionsToConsider?.[payload.page]?.sort_order &&
        lastSearchDoneFor[payload.tab] === payload.search;

      if (currentPageWasLoaded) {
        return;
      }

      if (payload.tab === NameRelatedCollectionsTabs.ByMembership) {
        setLoadingCollectionsByMembership(true);
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
                totalItems: {
                  ...navigationConfig.totalItems,
                  [NameRelatedCollectionsTabs.ByMembership]:
                    typeof res.metadata.total_number_of_matched_collections ===
                    "string" /**
                     * NameAI makes usage of a stringified "+1000" for
                     * res.metadata.total_number_of_matched_collections
                     * if there are more than 1000 collections this query
                     * is contained in. Since this is a different data type
                     * and we are handling number operations with totalItems,
                     * we are here normalizing this use case to use the number 1000
                     */
                      ? MAX_COLLECTIONS_NUMBER_NAME_API_CAN_DOCUMENT
                      : res.metadata.total_number_of_matched_collections,
                } as Record<NameRelatedCollectionsTabs, number | undefined>,
              });

              const relatedCollections = res.collections;

              setRelatedCollectionsByMembership({
                ...relatedCollectionsByMembership,
                [payload.page]: {
                  sort_order: payload.orderBy || DEFAULT_SORTING_ORDER,
                  related_collections: relatedCollections,
                },
              });
            } else {
              setRelatedCollectionsByMembership({
                ...relatedCollectionsByMembership,
                [payload.page]: null,
              });
            }
          })
          .catch(() => {
            setRelatedCollectionsByMembership({
              ...relatedCollectionsByMembership,
              [payload.page]: null,
            });
          })
          .finally(() => {
            setLoadingCollectionsByMembership(false);
            setLastSearchDoneFor({
              ...lastSearchDoneFor,
              [NameRelatedCollectionsTabs.ByMembership]: payload.search,
            });
          });
      } else {
        setLoadingCollectionByConcept(true);
        findCollectionsByString(query, {
          offset: (payload.page - 1) * navigationConfig.itemsPerPage,
          sort_order: payload.orderBy,
          max_total_collections:
            MAX_RELATED_COLLECTIONS + OTHER_COLLECTIONS_NUMBER,
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
                  ...navigationConfig.totalItems,
                  [NameRelatedCollectionsTabs.ByConcept]:
                    typeof res.metadata.total_number_of_matched_collections ===
                    "string" /**
                     * NameAI makes usage of a stringified "+1000" for
                     * res.metadata.total_number_of_matched_collections
                     * if there are more than 1000 collections this query
                     * is contained in. Since this is a different data type
                     * and we are handling number operations with totalItems,
                     * we are here normalizing this use case to use the number 1000
                     */
                      ? MAX_COLLECTIONS_NUMBER_NAME_API_CAN_DOCUMENT
                      : res.metadata.total_number_of_matched_collections,
                } as Record<NameRelatedCollectionsTabs, number | undefined>,
              });

              const relatedCollections = res.related_collections;

              setRelatedCollectionsByConcept({
                ...relatedCollectionsByConcept,
                [payload.page]: {
                  sort_order: payload.orderBy || DEFAULT_SORTING_ORDER,
                  related_collections: relatedCollections,
                },
              });
            } else {
              setRelatedCollectionsByConcept({
                ...relatedCollectionsByConcept,
                [payload.page]: null,
              });
            }
          })
          .catch(() => {
            setRelatedCollectionsByConcept({
              ...relatedCollectionsByConcept,
              [payload.page]: null,
            });
          })
          .finally(() => {
            setLoadingCollectionByConcept(false);
            setLastSearchDoneFor({
              ...lastSearchDoneFor,
              [NameRelatedCollectionsTabs.ByConcept]: payload.search,
            });
          });
      }
    }
  };

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) return;

    setParams({
      ...params,
      collectionsSearch: {
        ...params.collectionsSearch,
        search: searchTerm,
        page: {
          [NameRelatedCollectionsTabs.ByConcept]:
            params.collectionsSearch.page?.[
              NameRelatedCollectionsTabs.ByConcept
            ] || DEFAULT_PAGE_NUMBER,
          [NameRelatedCollectionsTabs.ByMembership]:
            params.collectionsSearch.page?.[
              NameRelatedCollectionsTabs.ByMembership
            ] || DEFAULT_PAGE_NUMBER,
        } as Record<NameRelatedCollectionsTabs, number | undefined>,
        activeTab: DEFAULT_ACTIVE_TAB,
      },
    });

    queryCollections({
      search: searchTerm,
      tab: DEFAULT_ACTIVE_TAB,
      page:
        params.collectionsSearch.page?.[
          params.collectionsSearch.activeTab || DEFAULT_ACTIVE_TAB
        ] || DEFAULT_PAGE_NUMBER,
      orderBy: params.collectionsSearch.orderBy || NameGraphSortOrderOptions.AI,
    });
  };

  const handlePageChange = (page: number) => {
    console.log(
      "Hey I will update the ",
      params.collectionsSearch.activeTab,
      "to page ",
      page,
    );
    setParams({
      ...params,
      collectionsSearch: {
        ...params.collectionsSearch,
        page: {
          ...params.collectionsSearch.page,
          [params.collectionsSearch.activeTab]: page,
        } as Record<NameRelatedCollectionsTabs, number | undefined>,
      },
    });

    queryCollections({
      search: params.collectionsSearch.search,
      tab: params.collectionsSearch.activeTab || DEFAULT_ACTIVE_TAB,
      page,
    });
  };

  const handleActiveTabChange = (activeTab: NameRelatedCollectionsTabs) => {
    setParams({
      ...params,
      collectionsSearch: {
        ...params.collectionsSearch,
        activeTab,
        page: {
          [NameRelatedCollectionsTabs.ByConcept]: DEFAULT_PAGE_NUMBER,
          [NameRelatedCollectionsTabs.ByMembership]: DEFAULT_PAGE_NUMBER,
          ...params.collectionsSearch.page,
        },
      },
    });

    getNavigationPageTextGuide(activeTab);
  };

  useEffect(() => {
    queryCollections({
      search: params.collectionsSearch.search,
      tab: params.collectionsSearch.activeTab,
      page:
        params.collectionsSearch.page?.[
          params.collectionsSearch.activeTab || DEFAULT_ACTIVE_TAB
        ] || DEFAULT_PAGE_NUMBER,
      orderBy: params.collectionsSearch.orderBy || NameGraphSortOrderOptions.AI,
    });
  }, [params.collectionsSearch.activeTab]);

  /**
   * Navigation helper functions
   */
  const [navigationConfig, setNavigationConfig] = useState<NavigationConfig>({
    itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    totalItems: {
      [NameRelatedCollectionsTabs.ByConcept]: undefined,
      [NameRelatedCollectionsTabs.ByMembership]: undefined,
    },
  });

  useEffect(() => {
    const activeTab = params.collectionsSearch.activeTab || DEFAULT_ACTIVE_TAB;

    if (
      /**
       * If the main results are already loaded
       * we load the results for the hidden tab
       */
      navigationConfig.totalItems &&
      navigationConfig.totalItems[activeTab as NameRelatedCollectionsTabs]
    ) {
      queryCollections({
        tab: getOppositeTab(),
        page:
          params.collectionsSearch.page?.[getOppositeTab()] ||
          DEFAULT_PAGE_NUMBER,
        orderBy: params.collectionsSearch.orderBy,
        search: params.collectionsSearch.search,
      });
    }
  }, [
    navigationConfig?.totalItems?.[NameRelatedCollectionsTabs.ByConcept],
    navigationConfig?.totalItems?.[NameRelatedCollectionsTabs.ByMembership],
  ]);

  const isFirstCollectionsPageForCurrentQuery = () => {
    const activeTab = params.collectionsSearch.activeTab || DEFAULT_ACTIVE_TAB;
    const currentPage =
      Number(params.collectionsSearch.page?.[activeTab]) || DEFAULT_PAGE_NUMBER;
    return currentPage <= 1;
  };

  const isLastCollectionsPageForCurrentQuery = () => {
    if (!navigationConfig.totalItems) return false;

    const activeTab = params.collectionsSearch.activeTab || DEFAULT_ACTIVE_TAB;
    const totalItems = navigationConfig.totalItems[activeTab];

    if (!totalItems) return false;

    const currentPage = Number(
      params.collectionsSearch.page?.[activeTab] || DEFAULT_PAGE_NUMBER,
    );

    return (
      totalItems <= navigationConfig.itemsPerPage ||
      currentPage * navigationConfig.itemsPerPage >= totalItems
    );
  };

  const [navigationPagesTextGuides, setNavigationPagesTextGuides] = useState<
    Record<NameRelatedCollectionsTabs, string>
  >({
    [NameRelatedCollectionsTabs.ByConcept]: "",
    [NameRelatedCollectionsTabs.ByMembership]: "",
  });

  const getNavigationPageTextGuide = (tab: NameRelatedCollectionsTabs) => {
    if (!navigationConfig.totalItems) {
      setNavigationPagesTextGuides({
        ...navigationPagesTextGuides,
        [tab]: "No name suggestions found",
      });
      return;
    }

    const totalItems = navigationConfig.totalItems[tab];
    if (!totalItems) return;

    const currentPage = Number(
      params.collectionsSearch.page?.[tab] || DEFAULT_PAGE_NUMBER,
    );
    const startItem = (currentPage - 1) * navigationConfig.itemsPerPage + 1;
    const endItem = Math.min(
      currentPage * navigationConfig.itemsPerPage,
      totalItems,
    );

    setNavigationPagesTextGuides({
      ...navigationPagesTextGuides,
      [tab]: `${startItem}-${endItem} of ${totalItems} name suggestions`,
    });
  };

  useEffect(() => {
    getNavigationPageTextGuide(NameRelatedCollectionsTabs.ByConcept);
  }, [
    params.collectionsSearch.page?.[NameRelatedCollectionsTabs.ByConcept],
    params.collectionsSearch.activeTab,
    navigationConfig.totalItems?.[NameRelatedCollectionsTabs.ByConcept],
    navigationConfig.itemsPerPage,
  ]);

  useEffect(() => {
    getNavigationPageTextGuide(NameRelatedCollectionsTabs.ByMembership);
  }, [
    params.collectionsSearch.page?.[NameRelatedCollectionsTabs.ByMembership],
    params.collectionsSearch.activeTab,
    navigationConfig.totalItems?.[NameRelatedCollectionsTabs.ByMembership],
    navigationConfig.itemsPerPage,
  ]);

  /**
   * This serves for us to query results in a wise manner:
   * We first query results for visible tab and later on for
   * hidden tab. This is necessary as we want to show the count
   * of results of both tabs as soon as possible. This is also wise
   * as we prioritize, always, querying first the results that will be
   * displayed in visitor's UI and later on the results that he/she can visit.
   */
  const getOppositeTab = (): NameRelatedCollectionsTabs => {
    const activeTab = params.collectionsSearch.activeTab || DEFAULT_ACTIVE_TAB;

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
    setParams({
      ...params,
      collectionsSearch: {
        ...params.collectionsSearch,
        orderBy,
        page: {
          ...params.collectionsSearch.page,
          [params.collectionsSearch.activeTab || DEFAULT_ACTIVE_TAB]:
            DEFAULT_PAGE_NUMBER,
        } as Record<NameRelatedCollectionsTabs, number | undefined>,
      },
    });

    queryCollections({
      search: params.collectionsSearch.search,
      tab: params.collectionsSearch.activeTab || DEFAULT_ACTIVE_TAB,
      page: DEFAULT_PAGE_NUMBER,
      orderBy,
    });
  };

  const hasLoadedResultsForTab = (tab: NameRelatedCollectionsTabs) => {
    const loadedResults = getLoadedResultsForTab(tab);

    return !!loadedResults;
  };

  const getLoadedResultsForTab = (
    tab: NameRelatedCollectionsTabs,
  ): null | CollectionsData | undefined => {
    const pages = params.collectionsSearch.page;

    if (!pages) return null;

    const activePage = pages[tab] || DEFAULT_PAGE_NUMBER;

    switch (tab) {
      case NameRelatedCollectionsTabs.ByConcept:
        return !!relatedCollectionsByConcept?.[activePage]
          ? relatedCollectionsByConcept[activePage]
          : null;
      case NameRelatedCollectionsTabs.ByMembership:
        return !!relatedCollectionsByMembership?.[activePage]
          ? relatedCollectionsByMembership[activePage]
          : null;
      default:
        return null;
    }
  };

  const [lastSearchDoneFor, setLastSearchDoneFor] = useState({
    [NameRelatedCollectionsTabs.ByConcept]: "",
    [NameRelatedCollectionsTabs.ByMembership]: "",
  });
  useEffect(() => {
    if (
      lastSearchDoneFor[params.collectionsSearch.activeTab] !==
      params.collectionsSearch.search
    ) {
      handleSearch(params.collectionsSearch.search);
    }
  }, [params.collectionsSearch.search]);

  const [searchEnsName, setSearchEnsName] = useState<ENSName | null>(null);
  useEffect(() => {
    setSearchEnsName(
      buildENSName(
        NameWithCurrentTld({
          params,
          name: params.collectionsSearch.search,
        }),
      ),
    );
  }, [params.tld.suffix, params.collectionsSearch.search]);

  return !params.collectionsSearch.search ? (
    <HomePage />
  ) : (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mx-auto py-8 w-full">
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-sm text-gray-500">
            Collection search results for
          </h1>
          <div className="flex space-x-6 mt-4 mb-3 items-center justify-start">
            <div>
              <NftAvatar
                withLink={false}
                name={searchEnsName}
                size={AvatarSize.SMALL}
                key={params.collectionsSearch.search}
              />
            </div>
            <Link
              href={getNameDetailsPageHref(
                params.collectionsSearch.search.replace(" ", ""),
              )}
              className="!text-3xl font-bold truncate"
            >
              {NameWithCurrentTld({
                name: params.collectionsSearch.search,
                params,
              })}
            </Link>
          </div>

          <Tabs
            defaultValue={
              params.collectionsSearch.activeTab || DEFAULT_ACTIVE_TAB
            }
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-5">
              <TabsList className="w-max">
                <TabsTriggers
                  navigationConfig={navigationConfig}
                  handleActiveTabChange={handleActiveTabChange}
                />
              </TabsList>

              <Select
                defaultValue={
                  params.collectionsSearch.orderBy ||
                  NameGraphSortOrderOptions.AI
                }
                onValueChange={(value) =>
                  handleOrderBy(value as NameGraphSortOrderOptions)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(
                    FromNameGraphSortOrderToDropdownTextContent,
                  ).map(([key]) => (
                    <SelectItem key={key} value={key}>
                      {
                        FromNameGraphSortOrderToDropdownTextContent[
                          key as NameGraphSortOrderOptions
                        ]
                      }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <TabsContents
              loadingCollectionByConcept={loadingCollectionByConcept}
              params={params}
              navigationConfig={navigationConfig}
              relatedCollectionsByMembership={relatedCollectionsByMembership}
              relatedCollectionsByConcept={relatedCollectionsByConcept}
              loadingCollectionsByMembership={loadingCollectionsByMembership}
              hasLoadedResultsForTab={hasLoadedResultsForTab}
              handlePageChange={handlePageChange}
              isFirstCollectionsPageForCurrentQuery={
                isFirstCollectionsPageForCurrentQuery
              }
              isLastCollectionsPageForCurrentQuery={
                isLastCollectionsPageForCurrentQuery
              }
              navigationPagesTextGuides={navigationPagesTextGuides}
            />
          </Tabs>
        </div>
      </div>
    </Suspense>
  );
}

const TabsTriggers = ({
  handleActiveTabChange,
  navigationConfig,
}: {
  handleActiveTabChange: (activeTab: NameRelatedCollectionsTabs) => void;
  navigationConfig: NavigationConfig;
}) => {
  const FromTabNameToTabLabel = {
    [NameRelatedCollectionsTabs.ByConcept]: "By concept",
    [NameRelatedCollectionsTabs.ByMembership]: "By membership",
  };

  return (
    <>
      {Object.entries(NameRelatedCollectionsTabs).map(([key, value]) => {
        return (
          <TabsTrigger
            key={value}
            value={key as NameRelatedCollectionsTabs}
            onClick={() =>
              handleActiveTabChange(key as NameRelatedCollectionsTabs)
            }
          >
            {FromTabNameToTabLabel[key as NameRelatedCollectionsTabs]}
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
      })}
    </>
  );
};

const TabsContents = ({
  params,
  hasLoadedResultsForTab,
  handlePageChange,
  isFirstCollectionsPageForCurrentQuery,
  isLastCollectionsPageForCurrentQuery,
  navigationPagesTextGuides,
  loadingCollectionByConcept,
  loadingCollectionsByMembership,
  relatedCollectionsByConcept,
  relatedCollectionsByMembership,
  navigationConfig,
}: {
  hasLoadedResultsForTab: (tab: NameRelatedCollectionsTabs) => boolean;
  handlePageChange: (page: number) => void;
  isFirstCollectionsPageForCurrentQuery: () => boolean;
  isLastCollectionsPageForCurrentQuery: () => boolean;
  params: QueryParams;
  navigationPagesTextGuides: Record<NameRelatedCollectionsTabs, string>;
  loadingCollectionByConcept: boolean;
  loadingCollectionsByMembership: boolean;
  relatedCollectionsByConcept:
    | undefined
    | null
    | Record<number, CollectionsData | null | undefined>;
  relatedCollectionsByMembership:
    | undefined
    | null
    | Record<number, CollectionsData | null | undefined>;
  navigationConfig: NavigationConfig;
}) => {
  useEffect(() => {
    console.log("relatedCollectionsByConcept", relatedCollectionsByConcept);
    console.log(
      "relatedCollectionsByMembership",
      relatedCollectionsByMembership,
    );
  }, [relatedCollectionsByMembership, relatedCollectionsByConcept]);
  useEffect(() => {
    console.log(
      "By Membership results:",
      relatedCollectionsByMembership?.[
        params.collectionsSearch.page?.[
          NameRelatedCollectionsTabs.ByMembership
        ] || DEFAULT_PAGE_NUMBER
      ]?.related_collections,
    );
    console.log(
      "By Concept results:",
      relatedCollectionsByConcept?.[
        params.collectionsSearch.page?.[NameRelatedCollectionsTabs.ByConcept] ||
          DEFAULT_PAGE_NUMBER
      ]?.related_collections,
    );
  }, [
    params.collectionsSearch.activeTab,
    params.collectionsSearch.page?.[NameRelatedCollectionsTabs.ByConcept],
    params.collectionsSearch.page?.[NameRelatedCollectionsTabs.ByMembership],
  ]);
  return (
    <>
      {Object.entries(NameRelatedCollectionsTabs).map(([key, value]) => {
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
                                        {
                                          navigationPagesTextGuides[
                                            NameRelatedCollectionsTabs.ByConcept
                                          ]
                                        }
                                      </div>
                                      {navigationConfig.totalItems ? (
                                        <div className="flex">
                                          <Button
                                            className="cursor-pointer p-[9px] bg-white shadow-none hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:hover:bg-white"
                                            disabled={isFirstCollectionsPageForCurrentQuery()}
                                            onClick={() =>
                                              handlePageChange(
                                                Number(
                                                  params.collectionsSearch
                                                    .page?.[
                                                    NameRelatedCollectionsTabs
                                                      .ByConcept
                                                  ] || DEFAULT_PAGE_NUMBER,
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
                                                  params.collectionsSearch
                                                    .page?.[
                                                    NameRelatedCollectionsTabs
                                                      .ByConcept
                                                  ] || DEFAULT_PAGE_NUMBER,
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
                                    ) : hasLoadedResultsForTab(
                                        NameRelatedCollectionsTabs.ByConcept,
                                      ) ? (
                                      relatedCollectionsByConcept[
                                        params.collectionsSearch.page?.[
                                          NameRelatedCollectionsTabs.ByConcept
                                        ] || DEFAULT_PAGE_NUMBER
                                      ]?.related_collections.map(
                                        (collection: NameGraphCollection) => (
                                          <CollectionCard
                                            key={collection.collection_id}
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
                                        {
                                          navigationPagesTextGuides[
                                            NameRelatedCollectionsTabs.ByConcept
                                          ]
                                        }
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          className="bg-white text-black shadow-none hover:bg-gray-50 text-sm p-2.5"
                                          disabled={isFirstCollectionsPageForCurrentQuery()}
                                          onClick={() =>
                                            handlePageChange(
                                              Number(
                                                params.collectionsSearch.page?.[
                                                  NameRelatedCollectionsTabs
                                                    .ByConcept
                                                ] || DEFAULT_PAGE_NUMBER,
                                              ) - 1,
                                            )
                                          }
                                        >
                                          <ChevronLeft />
                                          Prev
                                        </Button>
                                        <Button
                                          className="cursor-pointer p-[9px] bg-white shadow-none hover:bg-gray-50 rounded-lg disabled:opacity-50"
                                          disabled={isLastCollectionsPageForCurrentQuery()}
                                          onClick={() =>
                                            handlePageChange(
                                              Number(
                                                params.collectionsSearch.page?.[
                                                  NameRelatedCollectionsTabs
                                                    .ByConcept
                                                ] || DEFAULT_PAGE_NUMBER,
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
                                        {
                                          navigationPagesTextGuides[
                                            NameRelatedCollectionsTabs
                                              .ByMembership
                                          ]
                                        }
                                      </div>
                                      {navigationConfig.totalItems ? (
                                        <div className="flex">
                                          <Button
                                            className="cursor-pointer p-[9px] bg-white shadow-none hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:hover:bg-white"
                                            disabled={isFirstCollectionsPageForCurrentQuery()}
                                            onClick={() =>
                                              handlePageChange(
                                                Number(
                                                  params.collectionsSearch
                                                    .page?.[
                                                    NameRelatedCollectionsTabs
                                                      .ByMembership
                                                  ] || DEFAULT_PAGE_NUMBER,
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
                                                  params.collectionsSearch
                                                    .page?.[
                                                    NameRelatedCollectionsTabs
                                                      .ByMembership
                                                  ] || DEFAULT_PAGE_NUMBER,
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
                                    ) : hasLoadedResultsForTab(
                                        NameRelatedCollectionsTabs.ByMembership,
                                      ) ? (
                                      relatedCollectionsByMembership[
                                        params.collectionsSearch.page?.[
                                          NameRelatedCollectionsTabs
                                            .ByMembership
                                        ] || DEFAULT_PAGE_NUMBER
                                      ]?.related_collections.map(
                                        (collection: any) => (
                                          <CollectionCard
                                            key={collection.collection_id}
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
                                        {
                                          navigationPagesTextGuides[
                                            NameRelatedCollectionsTabs
                                              .ByMembership
                                          ]
                                        }
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          className="bg-white text-black shadow-none hover:bg-gray-50 text-sm p-2.5"
                                          disabled={isFirstCollectionsPageForCurrentQuery()}
                                          onClick={() =>
                                            handlePageChange(
                                              Number(
                                                params.collectionsSearch.page?.[
                                                  NameRelatedCollectionsTabs
                                                    .ByMembership
                                                ] || DEFAULT_PAGE_NUMBER,
                                              ) - 1,
                                            )
                                          }
                                        >
                                          <ChevronLeft />
                                          Prev
                                        </Button>
                                        <Button
                                          className="cursor-pointer p-[9px] bg-white shadow-none hover:bg-gray-50 rounded-lg disabled:opacity-50"
                                          disabled={isLastCollectionsPageForCurrentQuery()}
                                          onClick={() =>
                                            handlePageChange(
                                              Number(
                                                params.collectionsSearch.page?.[
                                                  NameRelatedCollectionsTabs
                                                    .ByMembership
                                                ] || DEFAULT_PAGE_NUMBER,
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
                      No related collections where found for this name
                    </p>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        );
      })}
    </>
  );
};
