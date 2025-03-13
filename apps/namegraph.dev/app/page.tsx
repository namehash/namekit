/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CollectionsCardsSkeleton } from "@/components/collections/collections-grid-skeleton";
import { CollectionCard } from "@/components/collections/collection-card";
import { buildENSName, ENSName } from "@namehash/ens-utils";
import { Link } from "@namehash/namekit-react";
import {
  NameWithCurrentTld,
  useQueryParams,
} from "@/components/use-query-params";
import { HomePage } from "@/components/homepage/homepage";
import { NftAvatar } from "@/components/nft-avatar/nft-avatar";
import { AvatarSize } from "@/components/nft-avatar/avatar-utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Skeleton from "@/components/skeleton";
import {
  DEFAULT_ACTIVE_TAB,
  DEFAULT_SORTING_ORDER,
} from "@/components/providers";
import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE_NUMBER,
  NameRelatedCollectionsTabs,
  MAX_NUMBER_OF_COLLECTIONS_MEMBERSHIP_IN_NAMEGRAPH_API,
  NavigationConfigurations,
  TabsCollectionsStorage,
} from "@/components/collections/utils";

export default function ExploreCollectionsPage() {
  const { params, setParams } = useQueryParams();
  const currentTab = params.collectionsSearch.tab || DEFAULT_ACTIVE_TAB;

  {
    /* Track page state for each tab independently */
  }
  const [pageState, setPageState] = useState({
    [NameRelatedCollectionsTabs.ByConcept]:
      params.collectionsSearch.page?.[NameRelatedCollectionsTabs.ByConcept] ||
      DEFAULT_PAGE_NUMBER,
    [NameRelatedCollectionsTabs.ByMembership]:
      params.collectionsSearch.page?.[
        NameRelatedCollectionsTabs.ByMembership
      ] || DEFAULT_PAGE_NUMBER,
  });

  const [collections, setCollections] = useState<TabsCollectionsStorage>({
    [NameRelatedCollectionsTabs.ByConcept]: {},
    [NameRelatedCollectionsTabs.ByMembership]: {},
  });

  const [loading, setLoading] = useState({
    [NameRelatedCollectionsTabs.ByConcept]: true,
    [NameRelatedCollectionsTabs.ByMembership]: true,
  });

  const [navigationConfig, setNavigationConfig] =
    useState<NavigationConfigurations>({
      itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
      totalItemsNumber: {
        [NameRelatedCollectionsTabs.ByConcept]: undefined,
        [NameRelatedCollectionsTabs.ByMembership]: undefined,
      },
    });

  const fetchCollections = useCallback(
    async (
      tab: keyof typeof NameRelatedCollectionsTabs,
      page: number,
      sortOrder: NameGraphSortOrderOptions,
      search: string,
    ) => {
      if (!search) return;

      setLoading((prev) => ({
        ...prev,
        [tab]: true,
      }));

      try {
        const query = getFirstLabelOfString(search);
        const MAX_COLLECTIONS_FOR_EXACT_MATCH = 10;
        const MAX_RELATED_COLLECTIONS = 20;
        const OTHER_COLLECTIONS_NUMBER = 5;
        const offset = (page - 1) * navigationConfig.itemsPerPage;

        if (tab === NameRelatedCollectionsTabs.ByMembership) {
          const response = await findCollectionsByMember(query, {
            offset,
            sort_order: sortOrder,
            limit_labels: MAX_COLLECTIONS_FOR_EXACT_MATCH,
            max_results: MAX_RELATED_COLLECTIONS,
          });

          if (response) {
            if (
              navigationConfig.totalItemsNumber[tab] !==
              response.metadata.total_number_of_matched_collections
            ) {
              setNavigationConfig((prev) => ({
                ...prev,
                totalItemsNumber: {
                  ...prev.totalItemsNumber,
                  [tab]: response.metadata.total_number_of_matched_collections,
                },
              }));
            }

            setCollections((prev) => ({
              ...prev,
              [tab]: {
                ...prev[tab],
                [page]: {
                  sort_order: sortOrder,
                  related_collections: response.collections,
                },
              },
            }));
          }
        } else {
          const response = await findCollectionsByString(query, {
            offset,
            sort_order: sortOrder,
            max_total_collections:
              MAX_RELATED_COLLECTIONS + OTHER_COLLECTIONS_NUMBER,
            max_related_collections: MAX_RELATED_COLLECTIONS,
            max_other_collections: OTHER_COLLECTIONS_NUMBER,
            min_other_collections: OTHER_COLLECTIONS_NUMBER,
          });

          if (response) {
            if (
              navigationConfig.totalItemsNumber[tab] !==
              response.metadata.total_number_of_matched_collections
            ) {
              setNavigationConfig((prev) => ({
                ...prev,
                totalItemsNumber: {
                  ...prev.totalItemsNumber,
                  [tab]: response.metadata.total_number_of_matched_collections,
                },
              }));
            }

            setCollections((prev) => ({
              ...prev,
              [tab]: {
                ...prev[tab],
                [page]: {
                  sort_order: sortOrder,
                  related_collections: response.related_collections,
                },
              },
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading((prev) => ({
          ...prev,
          [tab]: false,
        }));
      }
    },
    [navigationConfig.itemsPerPage],
  );

  const handlePageChange = useCallback(
    (newPage: number, tab: keyof typeof NameRelatedCollectionsTabs) => {
      {
        /* Update URL params first */
      }
      setParams({
        ...params,
        collectionsSearch: {
          ...params.collectionsSearch,
          page: {
            ...params.collectionsSearch.page,
            [tab]: newPage,
          } as Record<NameRelatedCollectionsTabs, undefined | number>,
        },
      });

      {
        /* Update local state */
      }
      setPageState((prev) => ({
        ...prev,
        [tab]: newPage,
      }));

      {
        /* Fetch new data */
      }
      fetchCollections(
        tab,
        newPage,
        params.collectionsSearch.orderBy || DEFAULT_SORTING_ORDER,
        params.collectionsSearch.search,
      );
    },
    [fetchCollections, params, setParams],
  );

  const handleTabChange = (tab: keyof typeof NameRelatedCollectionsTabs) => {
    setParams({
      ...params,
      collectionsSearch: {
        ...params.collectionsSearch,
        tab,
      },
    });

    /* When changing tabs, use the stored page number for that tab */
    const tabPage = pageState[tab];
    fetchCollections(
      tab,
      tabPage,
      params.collectionsSearch.orderBy || DEFAULT_SORTING_ORDER,
      params.collectionsSearch.search,
    );
  };

  const handleOrderBy = (orderBy: NameGraphSortOrderOptions) => {
    setParams({
      ...params,
      collectionsSearch: {
        ...params.collectionsSearch,
        orderBy,
      },
    });

    fetchCollections(
      currentTab,
      pageState[currentTab],
      orderBy,
      params.collectionsSearch.search,
    );
  };

  {
    /* Navigation helpers */
  }
  const isFirstPage = (tab: keyof typeof NameRelatedCollectionsTabs) => {
    return pageState[tab] <= 1;
  };

  const isLastPage = (tab: keyof typeof NameRelatedCollectionsTabs) => {
    if (!navigationConfig.totalItemsNumber?.[tab]) return true;

    const currentPage = pageState[tab];
    const totalItemsNumber = navigationConfig.totalItemsNumber[tab]!;

    return currentPage * navigationConfig.itemsPerPage >= totalItemsNumber;
  };

  const getNavigationTextGuide = (
    tab: keyof typeof NameRelatedCollectionsTabs,
  ) => {
    if (!navigationConfig.totalItemsNumber?.[tab]) {
      return "No collections";
    }

    const currentPage = pageState[tab];
    const displayableTotalItems = navigationConfig.totalItemsNumber[tab];
    let totalItemsNumber: undefined | number = undefined;
    if (typeof displayableTotalItems === "string") {
      totalItemsNumber = MAX_NUMBER_OF_COLLECTIONS_MEMBERSHIP_IN_NAMEGRAPH_API;
    } else {
      totalItemsNumber = displayableTotalItems;
    }

    if (!totalItemsNumber) return "No collections";

    const startItem = Math.min(
      (currentPage - 1) * navigationConfig.itemsPerPage + 1,
      totalItemsNumber,
    );
    const endItem = Math.min(
      currentPage * navigationConfig.itemsPerPage,
      totalItemsNumber,
    );

    return `${startItem}-${endItem} of ${displayableTotalItems} collections`;
  };

  const renderCollectionsContent = (
    tab: keyof typeof NameRelatedCollectionsTabs,
  ) => {
    const currentPage = pageState[tab];
    const isLoading = loading[tab];
    const currentCollections = collections[tab]?.[currentPage];

    if (isLoading) {
      return (
        <div className="w-full flex flex-col space-y-4">
          <CollectionsCardsSkeleton className="flex flex-col space-y-[30px]" />
          <CollectionsCardsSkeleton />
        </div>
      );
    }

    if (!currentCollections?.related_collections.length) {
      return (
        <div className="w-full min-h-[200px] flex items-center justify-center">
          <p className="text-sm text-gray-500">
            No collections
          </p>
        </div>
      );
    }

    return (
      <div className="w-full flex flex-col space-y-4">
        {currentCollections.related_collections.map(
          (collection: NameGraphCollection) => (
            <CollectionCard
              key={collection.collection_id}
              collection={collection}
            />
          ),
        )}
      </div>
    );
  };

  useEffect(() => {
    const currentPage = pageState[currentTab];
    fetchCollections(
      currentTab,
      currentPage,
      params.collectionsSearch.orderBy || DEFAULT_SORTING_ORDER,
      searchedEnsName?.name || params.collectionsSearch.search,
    );
  }, [currentTab, fetchCollections, params.collectionsSearch.orderBy]);

  const [searchedEnsName, setSearchedEnsName] = useState<ENSName | null>(null);
  useEffect(() => {
    setSearchedEnsName(
      buildENSName(
        NameWithCurrentTld({
          params,
          name: params.collectionsSearch.search,
        }),
      ),
    );
  }, [params.tld.suffix, params.collectionsSearch.search]);

  {
    /* Effect to fetch initial data for each tab */
  }
  useEffect(() => {
    Object.keys(NameRelatedCollectionsTabs).forEach((tab) => {
      const currentPage =
        pageState[tab as keyof typeof NameRelatedCollectionsTabs];
      fetchCollections(
        tab as keyof typeof NameRelatedCollectionsTabs,
        currentPage,
        params.collectionsSearch.orderBy || DEFAULT_SORTING_ORDER,
        searchedEnsName?.name || "",
      );
    });
  }, [searchedEnsName]);

  if (!params.collectionsSearch.search) {
    return <HomePage />;
  }

  return (
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
                name={searchedEnsName}
                size={AvatarSize.SMALL}
                key={searchedEnsName?.name || params.collectionsSearch.search}
              />
            </div>
            <Link
              href={
                searchedEnsName
                  ? getNameDetailsPageHref(
                      params.collectionsSearch.search.replace(" ", ""),
                    )
                  : ""
              }
              className="!text-3xl font-bold truncate"
            >
              {searchedEnsName?.name
                ? searchedEnsName.name
                : NameWithCurrentTld({
                    name:
                      searchedEnsName?.name || params.collectionsSearch.search,
                    params,
                  })}
            </Link>
          </div>

          <Tabs defaultValue={currentTab} value={currentTab}>
            <div className="flex justify-between flex-col space-y-4 md:space-y-0 md:flex-row">
              <TabsList className="w-max">
                {Object.entries(NameRelatedCollectionsTabs).map(([key]) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    onClick={() =>
                      handleTabChange(
                        key as keyof typeof NameRelatedCollectionsTabs,
                      )
                    }
                  >
                    {key === NameRelatedCollectionsTabs.ByConcept
                      ? "By concept"
                      : "By membership"}
                    <span className="w-16 ml-3 border border-gray-400 rounded-full">
                      {typeof (navigationConfig.totalItemsNumber?.[
                        key as keyof typeof NameRelatedCollectionsTabs
                      ]) === "undefined" ? (
                        <Skeleton className="mx-[1px] rounded-md w-[60px] h-4" />
                      ) : navigationConfig.totalItemsNumber?.[
                          key as keyof typeof NameRelatedCollectionsTabs
                        ] ===
                        MAX_NUMBER_OF_COLLECTIONS_MEMBERSHIP_IN_NAMEGRAPH_API ? (
                        "+1000"
                      ) : (
                        navigationConfig.totalItemsNumber?.[
                          key as keyof typeof NameRelatedCollectionsTabs
                        ]
                      )}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <Select
                defaultValue={
                  params.collectionsSearch.orderBy || DEFAULT_SORTING_ORDER
                }
                onValueChange={(value) =>
                  handleOrderBy(value as NameGraphSortOrderOptions)
                }
              >
                <SelectTrigger className="w-[120px]">
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

            {Object.entries(NameRelatedCollectionsTabs).map(([key]) => (
              <TabsContent
                key={key}
                value={key}
                className="w-full min-h-[400px]"
              >
                <div className="w-full h-full flex flex-col space-y-4 p-3 rounded-xl">
                  <div className="max-w-[756px] w-full flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-5">
                    <div className="flex items-center">
                      <div className="text-lg font-semibold mr-2.5">
                        {loading[
                          key as keyof typeof NameRelatedCollectionsTabs
                        ] ? (
                          <Skeleton className="w-[330px] h-7 my-1" />
                        ) : (
                          getNavigationTextGuide(
                            key as keyof typeof NameRelatedCollectionsTabs,
                          )
                        )}
                      </div>
                      {navigationConfig.totalItemsNumber?.[
                        key as keyof typeof NameRelatedCollectionsTabs
                      ] &&
                      !loading[
                        key as keyof typeof NameRelatedCollectionsTabs
                      ] ? (
                        <div className="flex">
                          <Button
                            className="cursor-pointer p-[9px] bg-white shadow-none hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:hover:bg-white"
                            disabled={isFirstPage(
                              key as keyof typeof NameRelatedCollectionsTabs,
                            )}
                            onClick={() =>
                              handlePageChange(
                                pageState[
                                  key as keyof typeof NameRelatedCollectionsTabs
                                ] - 1,
                                key as keyof typeof NameRelatedCollectionsTabs,
                              )
                            }
                          >
                            <ChevronLeft className="w-6 h-6 text-black" />
                          </Button>
                          <Button
                            className="cursor-pointer p-[9px] bg-white shadow-none hover:bg-gray-50 rounded-lg disabled:opacity-50"
                            disabled={isLastPage(
                              key as keyof typeof NameRelatedCollectionsTabs,
                            )}
                            onClick={() =>
                              handlePageChange(
                                pageState[
                                  key as keyof typeof NameRelatedCollectionsTabs
                                ] + 1,
                                key as keyof typeof NameRelatedCollectionsTabs,
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
                  <div className="w-full flex-1">
                    {renderCollectionsContent(
                      key as keyof typeof NameRelatedCollectionsTabs,
                    )}
                  </div>

                  {/* Bottom Pagination */}
                  {navigationConfig.totalItemsNumber?.[
                    key as keyof typeof NameRelatedCollectionsTabs
                  ] &&
                  !loading[key as keyof typeof NameRelatedCollectionsTabs] ? (
                    <div className="flex items-center justify-between border border-gray-200 border-l-0 border-r-0 border-b-0 mt-3 p-3">
                      <div className="text-sm text-gray-500 mr-2.5">
                        {getNavigationTextGuide(
                          key as keyof typeof NameRelatedCollectionsTabs,
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          className="bg-white text-black shadow-none hover:bg-gray-50 text-sm p-2.5"
                          disabled={isFirstPage(
                            key as keyof typeof NameRelatedCollectionsTabs,
                          )}
                          onClick={() =>
                            handlePageChange(
                              pageState[
                                key as keyof typeof NameRelatedCollectionsTabs
                              ] - 1,
                              key as keyof typeof NameRelatedCollectionsTabs,
                            )
                          }
                        >
                          <ChevronLeft />
                          Prev
                        </Button>
                        <Button
                          className="bg-white text-black shadow-none hover:bg-gray-50 text-sm p-2.5"
                          disabled={isLastPage(
                            key as keyof typeof NameRelatedCollectionsTabs,
                          )}
                          onClick={() =>
                            handlePageChange(
                              pageState[
                                key as keyof typeof NameRelatedCollectionsTabs
                              ] + 1,
                              key as keyof typeof NameRelatedCollectionsTabs,
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
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </Suspense>
  );
}
