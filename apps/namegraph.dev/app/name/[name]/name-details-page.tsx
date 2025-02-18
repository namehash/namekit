/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  useQueryParams,
  NameWithCurrentTld,
} from "@/components/use-query-params";
import {
  ProfileStats,
  useProfileDetails,
  ProfileSocials,
} from "ethereum-identity-kit";
import { useEnsText } from "wagmi";
import { ens_normalize } from "@adraffy/ens-normalize";
import { buildENSName } from "@namehash/ens-utils";
import useSWR from "swr";
import { nameguard, NameGuardReport } from "@namehash/nameguard";
import {
  DEFAULT_MAX_RELATED_COLLECTIONS,
  NameGraphCollection,
  NameGraphSortOrderOptions,
  NameGraphSuggestion,
} from "@namehash/namegraph-sdk/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NftAvatar } from "@/components/nft-avatar/nft-avatar";
import { AvatarSize } from "@/components/nft-avatar/avatar-utils";
import { NameGuardSummary } from "@/components/name/nameguard-summary";
import { TokenAnalysisResults } from "@/components/name-ai/results";
import { TokenAnalysisResultsSkeleton } from "@/components/name-ai/skeleton";
import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE_NUMBER,
  MAX_NUMBER_OF_COLLECTIONS_MEMBERSHIP_IN_NAMEGRAPH_API,
  NameRelatedCollectionsTabs,
  NavigationConfigurations,
  TabsCollectionsStorage,
} from "@/components/collections/utils";
import {
  DEFAULT_ACTIVE_TAB,
  DEFAULT_SORTING_ORDER,
} from "@/components/providers";
import {
  findCollectionsByMember,
  findCollectionsByString,
  FromNameGraphSortOrderToDropdownTextContent,
  getCollectionsForQuery,
  getNameDetailsPageHref,
} from "@/lib/utils";
import { CollectionCard } from "@/components/collections/collection-card";
import { CollectionsCardsSkeleton } from "@/components/collections/collections-grid-skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Skeleton from "@/components/skeleton";
import { analyzeLabel } from "@/components/name-ai/actions";
import { Link } from "@namehash/namekit-react";
import { NLPLabelAnalysis } from "@namehash/nameai";

interface CollectionsData {
  sort_order: NameGraphSortOrderOptions;
  related_collections: any[];
}

export const NameDetailsPage = ({ name }: { name: string }) => {
  let label = name;
  try {
    label = ens_normalize(decodeURI(name));
  } catch {
    console.error(`Error: ${name} is not normalized`);
  }

  const { params, setParams } = useQueryParams();
  const currentTab = params.nameDetails.tab || DEFAULT_ACTIVE_TAB;

  {
    /* Collections state with separate page tracking for each tab */
  }
  const [pageState, setPageState] = useState({
    [NameRelatedCollectionsTabs.ByConcept]:
      params.nameDetails.page?.[NameRelatedCollectionsTabs.ByConcept] ||
      DEFAULT_PAGE_NUMBER,
    [NameRelatedCollectionsTabs.ByMembership]:
      params.nameDetails.page?.[NameRelatedCollectionsTabs.ByMembership] ||
      DEFAULT_PAGE_NUMBER,
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

  const [otherCategories, setOtherCategories] = useState<any[] | undefined>(
    undefined,
  );
  const [loadingLabelAnalysis, setLoadingLabelAnalysis] = useState(true);
  const [labelAnalysis, setLabelAnalysis] = useState<
    NLPLabelAnalysis | undefined
  >(undefined);

  {
    /* Profile data */
  }
  const { address } = useProfileDetails({
    addressOrName: NameWithCurrentTld({ name, params }),
  });

  const { data: telegramRecord } = useEnsText({
    name: NameWithCurrentTld({ name: label, params }),
    key: "org.telegram",
  });

  const { data: twitterRecord } = useEnsText({
    name: NameWithCurrentTld({ name: label, params }),
    key: "com.twitter",
  });

  const { data: githubRecord } = useEnsText({
    name: NameWithCurrentTld({ name: label, params }),
    key: "com.github",
  });

  const { data: discordRecord } = useEnsText({
    name: NameWithCurrentTld({ name: label, params }),
    key: "com.discord",
  });

  const { data: nameguardReport } = useSWR<NameGuardReport>(
    NameWithCurrentTld({ name: label, params }),
    (n: string) => nameguard.inspectName(n),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const fetchCollections = useCallback(
    async (
      tab: keyof typeof NameRelatedCollectionsTabs,
      page: number,
      sortOrder: NameGraphSortOrderOptions,
    ) => {
      {
        /* Set loading only for the current tab */
      }
      setLoading((prev) => ({
        ...prev,
        [tab]: true,
      }));

      try {
        const query = label;
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
            const totalItemsNumber =
              response.metadata.total_number_of_matched_collections ??
              MAX_NUMBER_OF_COLLECTIONS_MEMBERSHIP_IN_NAMEGRAPH_API;

            setNavigationConfig((prev) => ({
              ...prev,
              totalItemsNumber: {
                ...prev.totalItemsNumber,
                [tab]: totalItemsNumber,
              },
            }));

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
            const totalItemsNumber =
              response.metadata.total_number_of_matched_collections ??
              MAX_NUMBER_OF_COLLECTIONS_MEMBERSHIP_IN_NAMEGRAPH_API;

            setNavigationConfig((prev) => ({
              ...prev,
              totalItemsNumber: {
                ...prev.totalItemsNumber,
                [tab]: totalItemsNumber,
              },
            }));

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
    [label, navigationConfig.itemsPerPage],
  );

  const handlePageChange = useCallback(
    (newPage: number, tab: keyof typeof NameRelatedCollectionsTabs) => {
      {
        /* Update URL params first */
      }
      setParams({
        ...params,
        nameDetails: {
          ...params.nameDetails,
          page: {
            ...params.nameDetails.page,
            [tab]: newPage,
          } as Record<NameRelatedCollectionsTabs, number | undefined>,
        },
      });

      {
        /* Then update local state */
      }
      setPageState((prev) => ({
        ...prev,
        [tab]: newPage,
      }));

      {
        /* Finally fetch new data */
      }
      fetchCollections(
        tab,
        newPage,
        params.nameDetails.orderBy || DEFAULT_SORTING_ORDER,
      );
    },
    [fetchCollections, params, setParams],
  );

  const handleTabChange = (tab: keyof typeof NameRelatedCollectionsTabs) => {
    setParams({
      ...params,
      nameDetails: {
        ...params.nameDetails,
        tab,
      },
    });
  };

  const handleOrderBy = (orderBy: NameGraphSortOrderOptions) => {
    setParams({
      ...params,
      nameDetails: {
        ...params.nameDetails,
        orderBy,
      },
    });

    fetchCollections(currentTab, pageState[currentTab], orderBy);
  };

  useEffect(() => {
    const currentPage = pageState[currentTab];
    fetchCollections(
      currentTab,
      currentPage,
      params.nameDetails.orderBy || DEFAULT_SORTING_ORDER,
    );
  }, [currentTab, fetchCollections, params.nameDetails.orderBy]);

  useEffect(() => {
    if (
      navigationConfig.totalItemsNumber?.[
        NameRelatedCollectionsTabs.ByConcept
      ] &&
      navigationConfig.totalItemsNumber?.[
        NameRelatedCollectionsTabs.ByMembership
      ]
    ) {
      getCollectionsForQuery(label, DEFAULT_MAX_RELATED_COLLECTIONS)
        .then((res) => setOtherCategories(res.categories))
        .catch((err) => {
          console.error(err);
          setOtherCategories([]);
        });
    }
  }, [navigationConfig.totalItemsNumber, label]);

  useEffect(() => {
    setLoadingLabelAnalysis(true);
    analyzeLabel(label)
      .then((res) => setLabelAnalysis(res.analysis))
      .finally(() => setLoadingLabelAnalysis(false));
  }, [label]);

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
      return "No name suggestions found";
    }

    const currentPage = pageState[tab];
    const displayableTotalItems = navigationConfig.totalItemsNumber[tab];
    let totalItemsNumber: undefined | number = undefined;
    if (typeof displayableTotalItems === "string") {
      totalItemsNumber = MAX_NUMBER_OF_COLLECTIONS_MEMBERSHIP_IN_NAMEGRAPH_API;
    } else {
      totalItemsNumber = displayableTotalItems;
    }

    if (!totalItemsNumber) return "No name suggestions found";

    const startItem = Math.min(
      (currentPage - 1) * navigationConfig.itemsPerPage + 1,
      totalItemsNumber,
    );
    const endItem = Math.min(
      currentPage * navigationConfig.itemsPerPage,
      totalItemsNumber,
    );

    return `${startItem}-${endItem} of ${displayableTotalItems} name suggestions`;
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
            No collections found for the current page
          </p>
        </div>
      );
    }

    return (
      <div className="w-full flex flex-col space-y-4">
        {currentCollections.related_collections.map(
          (collection: NameGraphCollection) => (
            <div key={collection.collection_id} className="w-full">
              <CollectionCard collection={collection} />
            </div>
          ),
        )}
      </div>
    );
  };

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
        params.nameDetails.orderBy || DEFAULT_SORTING_ORDER,
      );
    });
  }, []);

  return (
    <div className="max-w-7xl flex flex-col space-y-8 lg:space-y-0 lg:grid lg:gap-8 lg:grid-cols-[335px_minmax(335px,_1fr)] mx-auto py-8 w-full">
      {/* Left Column */}
      <div className="flex justify-start flex-col mx-8 lg:mx-6 xl:mx-0">
        <div className="mx-auto">
          <NftAvatar
            name={
              label
                ? buildENSName(
                    NameWithCurrentTld({
                      name: label,
                      params,
                    }),
                  )
                : null
            }
            size={AvatarSize.HUGE}
            withLink={false}
            is3d={true}
          />
        </div>

        <div className="mt-8 flex flex-col space-y-4 md:space-y-0 lg:space-y-6 md:flex-row lg:flex-col md:space-x-4 lg:space-x-0">
          {/* Profile Info */}
          <div className="h-max py-6 border border-gray-200 rounded-md md:w-1/2 lg:w-auto">
            <ProfileStats
              addressOrName={NameWithCurrentTld({ name, params })}
            />
            <ProfileSocials
              userAddress={address}
              name={NameWithCurrentTld({ name, params })}
              records={{
                "org.telegram": telegramRecord || "",
                "com.twitter": twitterRecord || "",
                "com.github": githubRecord || "",
                "com.discord": discordRecord || "",
              }}
            />
          </div>

          {/* NameGuard Summary */}
          <div className="w-full flex justify-center items-center border border-gray-200 rounded-md md:w-1/2 lg:w-auto">
            <NameGuardSummary nameGuardReport={nameguardReport} />
          </div>
        </div>

        {/* Label Analysis */}
        <div>
          {loadingLabelAnalysis ? (
            <div className="mt-8">
              <TokenAnalysisResultsSkeleton />
            </div>
          ) : labelAnalysis ? (
            <div className="mt-8">
              <TokenAnalysisResults analysis={labelAnalysis} />
            </div>
          ) : null}
        </div>

        {/* Other Categories */}
        {otherCategories && otherCategories.length > 0 && (
          <div className="mx-auto w-full mt-12">
            <div className="w-full rounded-lg border border-gray-200">
              <p className="text-[18px] font-semibold px-5 py-2.5 border-b border-gray-200">
                Explore other names
              </p>
              {otherCategories.map((collection) => (
                <div key={collection.collection_id}>
                  <p className="py-3 px-5 font-semibold text-sm text-gray-500">
                    {collection.name}
                  </p>
                  <div className="flex flex-col">
                    {collection.suggestions
                      .slice(0, 3)
                      .map((suggestion: NameGraphSuggestion) => (
                        <Link
                          key={suggestion.label}
                          href={getNameDetailsPageHref(suggestion.label)}
                          className="p-5 border-t border-gray-200 font-semibold text-base text-black"
                        >
                          {NameWithCurrentTld({
                            name: suggestion.label,
                            params,
                          })}
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Collections */}
      <div className="mx-auto space-y-8 w-full">
        <div className="mx-auto p-6">
          {/* Title */}
          <div className="flex space-x-4 mb-8">
            <div>
              <div className="text-3xl lg:text-5xl font-bold mb-4 break-all">
                {label ? (
                  <>{NameWithCurrentTld({ name: label, params })}</>
                ) : (
                  <Skeleton className="w-40 h-8" />
                )}
              </div>
            </div>
          </div>

          {/* Collections Tabs */}
          <div className="flex space-x-4">
            <div className="w-full">
              <div className="w-full space-y-4">
                <Tabs defaultValue={currentTab} value={currentTab}>
                  <div className="flex justify-between flex-col space-y-4 md:space-y-0 md:flex-row">
                    {/* Tab List */}
                    <TabsList className="w-max">
                      {Object.entries(NameRelatedCollectionsTabs).map(
                        ([key]) => (
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
                              {navigationConfig.totalItemsNumber?.[
                                key as keyof typeof NameRelatedCollectionsTabs
                              ] ? (
                                navigationConfig.totalItemsNumber?.[
                                  key as keyof typeof NameRelatedCollectionsTabs
                                ]
                              ) : (
                                <Skeleton className="mx-[1px] rounded-md w-[60px] h-4" />
                              )}
                            </span>
                          </TabsTrigger>
                        ),
                      )}
                    </TabsList>

                    {/* Sort Order Select */}
                    <Select
                      defaultValue={
                        params.nameDetails.orderBy || DEFAULT_SORTING_ORDER
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

                  {/* Tab Content */}
                  {Object.entries(NameRelatedCollectionsTabs).map(([key]) => (
                    <TabsContent
                      key={key}
                      value={key}
                      className="w-full min-h-[400px]"
                    >
                      <div className="w-full h-full flex flex-col space-y-4 p-3 rounded-xl border border-gray-200">
                        {/* Collection Count and Navigation */}
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
                              ] && (
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
                              )}
                          </div>
                        </div>

                        {/* Collections List */}
                        <div className="w-full flex-1">
                          {renderCollectionsContent(
                            key as keyof typeof NameRelatedCollectionsTabs,
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameDetailsPage;
