"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import {
  ProfileStats,
  useProfileDetails,
  ProfileSocials,
} from "ethereum-identity-kit";
import {
  DEFAULT_MAX_RELATED_COLLECTIONS,
  NameGraphCollection,
  NameGraphFetchTopCollectionMembersResponse,
  NameGraphSortOrderOptions,
} from "@namehash/namegraph-sdk/utils";
import { useEnsText } from "wagmi";
import { useEffect, useState } from "react";
import Skeleton from "@/components/skeleton";
import { Button } from "@/components/ui/button";
import {
  NameWithCurrentTld,
  useQueryParams,
} from "@/components/use-query-params";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CollectionCard } from "@/components/collections/collection-card";
import {
  findCollectionsByMember,
  findCollectionsByString,
  FromNameGraphSortOrderToDropdownTextContent,
  getCollectionsForQuery,
  getFirstLabelOfString,
  getNameDetailsPageHref,
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
import { buildENSName } from "@namehash/ens-utils";
import { NftAvatar } from "@/components/nft-avatar/nft-avatar";
import { ens_normalize } from "@adraffy/ens-normalize";
import { AvatarSize } from "@/components/nft-avatar/avatar-utils";
import { DEFAULT_PAGE_NUMBER } from "@/components/collections/utils";
import {
  DEFAULT_ACTIVE_TAB,
  DEFAULT_SORTING_ORDER,
} from "@/components/providers";
import useSWR from "swr";
import { nameguard, NameGuardReport } from "@namehash/nameguard";
import { NameGuardSummary } from "@/components/name/nameguard-summary";
import { TokenAnalysisResults } from "@/components/name-ai/results";
import { analyzeLabel } from "@/components/name-ai/actions";
import { TokenAnalysisResultsSkeleton } from "@/components/name-ai/skeleton";
import { NLPLabelAnalysis } from "@namehash/nameai";
import { DEFAULT_ITEMS_PER_PAGE } from "./types";

interface NavigationConfig {
  itemsPerPage: number;
  totalItems?: Record<NameRelatedCollectionsTabs, number | undefined>;
}

export interface CollectionsData {
  sort_order: NameGraphSortOrderOptions;
  related_collections: NameGraphCollection[];
}

export const NameRelatedCollectionsTabs = {
  ByMembership: "ByMembership",
  ByConcept: "ByConcept",
} as const;

export type NameRelatedCollectionsTabs =
  (typeof NameRelatedCollectionsTabs)[keyof typeof NameRelatedCollectionsTabs];

export const NameDetailsPage = ({ name }: { name: string }) => {
  let label = name;
  try {
    label = ens_normalize(decodeURI(name));
  } catch {
    console.error(`Error: ${name} is not normalized`);
  }

  const { params, setParams } = useQueryParams();

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

  const queryCollections = (payload: QueryNameRelatedCollectionsParams) => {
    if (label) {
      const query = getFirstLabelOfString(label);

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
      if (payload.activeTab === DEFAULT_ACTIVE_TAB) {
        currentCollectionsToConsider = relatedCollectionsByConcept;
      }

      const currentPageWasLoaded =
        !!currentCollectionsToConsider?.[payload.page] &&
        payload.orderBy ==
          currentCollectionsToConsider?.[payload.page]?.sort_order;

      if (currentPageWasLoaded) {
        return;
      }

      if (payload.activeTab === NameRelatedCollectionsTabs.ByMembership) {
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
                  [NameRelatedCollectionsTabs.ByConcept]:
                    navigationConfig.totalItems?.[
                      NameRelatedCollectionsTabs.ByConcept
                    ],
                  [NameRelatedCollectionsTabs.ByMembership]:
                    typeof res.metadata.total_number_of_matched_collections ===
                    "number"
                      ? res.metadata.total_number_of_matched_collections
                      : /**
                         * NameAI makes usage of a stringified "+1000" for
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
          });
      } else {
        setLoadingCollectionByConcept(true);
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
                         * NameAI makes usage of a stringified "+1000" for
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
          });
      }
    }
  };

  /**
   * Table query
   */
  const handlePageChange = (page: number) => {
    setParams({
      ...params,
      nameDetails: {
        ...params.nameDetails,
        page: {
          ...params.nameDetails.page,
          [params.nameDetails.activeTab || DEFAULT_ACTIVE_TAB]: page,
        } as Record<NameRelatedCollectionsTabs, number | undefined>,
      },
    });

    queryCollections({
      page,
      activeTab: params.nameDetails.activeTab || DEFAULT_ACTIVE_TAB,
    });
  };

  const handleActiveTabChange = (activeTab: NameRelatedCollectionsTabs) => {
    setParams({
      ...params,
      nameDetails: {
        ...params.nameDetails,
        activeTab,
      },
    });

    getNavigationPageTextGuide(activeTab);
  };

  useEffect(() => {
    queryCollections({
      page:
        params.nameDetails.page?.[
          params.nameDetails.activeTab || DEFAULT_ACTIVE_TAB
        ] || DEFAULT_PAGE_NUMBER,
      activeTab: params.nameDetails.activeTab,
    });
  }, [params.nameDetails.activeTab]);

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
    const activeTab = params.nameDetails.activeTab || DEFAULT_ACTIVE_TAB;

    if (
      /**
       * If the results of both tabs are already
       * loaded, we load the other categories results
       */
      navigationConfig.totalItems &&
      navigationConfig.totalItems[NameRelatedCollectionsTabs.ByConcept] &&
      navigationConfig.totalItems[NameRelatedCollectionsTabs.ByMembership]
    ) {
      getCollectionsForQuery(label, DEFAULT_MAX_RELATED_COLLECTIONS)
        .then((res) => {
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
          params.nameDetails.page?.[
            params.nameDetails.activeTab || DEFAULT_ACTIVE_TAB
          ] || DEFAULT_PAGE_NUMBER,
        orderBy: params.nameDetails.orderBy,
      });
    }
  }, [navigationConfig?.totalItems]);

  const isFirstCollectionsPageForCurrentQuery = () => {
    const activeTab = params.nameDetails.activeTab || DEFAULT_ACTIVE_TAB;
    const currentPage =
      Number(params.nameDetails.page?.[activeTab]) || DEFAULT_PAGE_NUMBER;
    return currentPage <= 1;
  };
  const isLastCollectionsPageForCurrentQuery = () => {
    if (!navigationConfig.totalItems) return false;

    const activeTab = params.nameDetails.activeTab || DEFAULT_ACTIVE_TAB;
    const totalItems = navigationConfig.totalItems[activeTab];

    if (!totalItems) return false;

    const currentPage = Number(
      params.nameDetails.page?.[activeTab] || DEFAULT_PAGE_NUMBER,
    );

    return (
      totalItems <= navigationConfig.itemsPerPage ||
      currentPage * navigationConfig.itemsPerPage >= totalItems
    );
  };

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
      params.nameDetails.page?.[tab] || DEFAULT_PAGE_NUMBER,
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

  const [navigationPagesTextGuides, setNavigationPagesTextGuides] = useState<
    Record<NameRelatedCollectionsTabs, string>
  >({
    [NameRelatedCollectionsTabs.ByConcept]: "",
    [NameRelatedCollectionsTabs.ByMembership]: "",
  });

  useEffect(() => {
    getNavigationPageTextGuide(NameRelatedCollectionsTabs.ByConcept);
  }, [
    params.nameDetails.page?.[NameRelatedCollectionsTabs.ByConcept],
    params.nameDetails.activeTab,
    navigationConfig.totalItems,
    navigationConfig.itemsPerPage,
  ]);

  useEffect(() => {
    getNavigationPageTextGuide(NameRelatedCollectionsTabs.ByMembership);
  }, [
    params.nameDetails.page?.[NameRelatedCollectionsTabs.ByMembership],
    params.nameDetails.activeTab,
    navigationConfig.totalItems,
    navigationConfig.itemsPerPage,
  ]);

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
    const activeTab = params.nameDetails.activeTab || DEFAULT_ACTIVE_TAB;

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
    setParams({ ...params, nameDetails: { ...params.nameDetails, orderBy } });
    queryCollections({
      activeTab: params.nameDetails.activeTab || DEFAULT_ACTIVE_TAB,
      page:
        params.nameDetails.page?.[
          params.nameDetails.activeTab || DEFAULT_ACTIVE_TAB
        ] || DEFAULT_PAGE_NUMBER,
      orderBy,
    });
  };

  const hasLoadedResultsForTab = (tab: NameRelatedCollectionsTabs) => {
    const loadedResults = getLoadedResultsForTab(tab);

    return !!loadedResults;
  };

  const getLoadedResultsForTab = (
    tab: NameRelatedCollectionsTabs,
  ): null | CollectionsData => {
    const pages = params.nameDetails.page;

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

  const [loadingLabelAnalysis, setLoadingLabelAnalysis] = useState(true);
  const [labelAnalysis, setLabelAnalysis] = useState<
    NLPLabelAnalysis | undefined
  >(undefined);
  useEffect(() => {
    setLoadingLabelAnalysis(true);
    analyzeLabel(label)
      .then((res) => {
        setLabelAnalysis(res.analysis);
      })
      .finally(() => setLoadingLabelAnalysis(false));
  }, [label]);

  return (
    <div className="max-w-7xl flex flex-col space-y-8 lg:space-y-0 lg:space-x-8 lg:flex-row mx-auto py-8 w-full">
      <div className="flex justify-start flex-col mx-8 lg:mx-6 xl:mx-0">
        <div className="mx-auto">
          <NftAvatar
            name={
              label && params.tld.suffix
                ? buildENSName(NameWithCurrentTld({ name: label, params }))
                : null
            }
            size={AvatarSize.HUGE}
            withLink={false}
            is3d={true}
          />
        </div>
        <div className="mt-8 flex flex-col space-y-4 md:space-y-0 lg:space-y-6 md:flex-row lg:flex-col md:space-x-4 lg:space-x-0">
          <div className="h-max py-6 border border-gray-200 rounded-md md:w-1/2 lg:w-auto">
            <ProfileStats
              addressOrName={NameWithCurrentTld({ name, params })}
            />
            <ProfileSocials
              userAddress={address}
              name={NameWithCurrentTld({
                name,
                params,
              })}
              records={{
                "org.telegram": telegramRecord || "",
                "com.twitter": twitterRecord || "",
                "com.github": githubRecord || "",
                "com.discord": discordRecord || "",
              }}
            />
          </div>
          <div className="w-full flex justify-center items-center border border-gray-200 rounded-md md:w-1/2 lg:w-auto">
            <NameGuardSummary nameGuardReport={nameguardReport} />
          </div>
        </div>
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
        {otherCategories?.length ? (
          <div className="mx-auto w-full mt-12">
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
                            href={getNameDetailsPageHref(suggestion.label)}
                            className="p-5 border-t border-gray-200 font-semibold text-base text-black"
                          >
                            {NameWithCurrentTld({
                              name: suggestion.label,
                              params,
                            })}
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
      <div className="mx-auto space-y-8 w-full">
        <div className="mx-auto p-6">
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
          <div className="flex space-x-4">
            <div className="w-full">
              {/* Collections List */}
              <div className="w-full space-y-4">
                <Tabs
                  defaultValue={
                    params.nameDetails.activeTab || DEFAULT_ACTIVE_TAB
                  }
                >
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
                        params.nameDetails.orderBy ||
                        NameGraphSortOrderOptions.AI
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
                                                      {
                                                        navigationPagesTextGuides[
                                                          NameRelatedCollectionsTabs
                                                            .ByConcept
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
                                                                params
                                                                  .nameDetails
                                                                  .page?.[
                                                                  params
                                                                    .nameDetails
                                                                    .activeTab ||
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
                                                                params
                                                                  .nameDetails
                                                                  .page?.[
                                                                  params
                                                                    .nameDetails
                                                                    .activeTab ||
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
                                                  ) : hasLoadedResultsForTab(
                                                      NameRelatedCollectionsTabs.ByConcept,
                                                    ) ? (
                                                    getLoadedResultsForTab(
                                                      NameRelatedCollectionsTabs.ByConcept,
                                                    )?.related_collections.map(
                                                      (collection) => (
                                                        <CollectionCard
                                                          key={
                                                            collection.collection_id
                                                          }
                                                          collection={
                                                            collection
                                                          }
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
                                                            .ByConcept
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
                                                              params.nameDetails
                                                                .page?.[
                                                                params
                                                                  .nameDetails
                                                                  .activeTab ||
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
                                                              params.nameDetails
                                                                .page?.[
                                                                params
                                                                  .nameDetails
                                                                  .activeTab ||
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
                                                                params
                                                                  .nameDetails
                                                                  .page?.[
                                                                  params
                                                                    .nameDetails
                                                                    .activeTab ||
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
                                                                params
                                                                  .nameDetails
                                                                  .page?.[
                                                                  params
                                                                    .nameDetails
                                                                    .activeTab ||
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
                                                  ) : hasLoadedResultsForTab(
                                                      NameRelatedCollectionsTabs.ByMembership,
                                                    ) ? (
                                                    getLoadedResultsForTab(
                                                      NameRelatedCollectionsTabs.ByMembership,
                                                    )?.related_collections.map(
                                                      (collection: any) => (
                                                        <CollectionCard
                                                          key={
                                                            collection.collection_id
                                                          }
                                                          collection={
                                                            collection
                                                          }
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
                                                              params.nameDetails
                                                                .page?.[
                                                                params
                                                                  .nameDetails
                                                                  .activeTab ||
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
                                                              params.nameDetails
                                                                .page?.[
                                                                params
                                                                  .nameDetails
                                                                  .activeTab ||
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
      </div>
    </div>
  );
};
