"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import { SetStateAction, useEffect, useState } from "react";
import { Noto_Emoji } from "next/font/google";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CollectionCard } from "@/components/collections/collection-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Skeleton from "@/components/skeleton";
import { ScrambleMethod } from "@namehash/namegraph-sdk/utils";
import { QueryParams, useQueryParams } from "@/components/use-query-params";
import {
  fetchCollectionMembers,
  findCollectionsByCollection,
  getCollectionById,
  sampleNamesByCollectionId,
  scrambleNamesByCollectionId,
} from "@/lib/utils";
import { NameSuggestionsList } from "@/components/utils/name-suggestions-list";
import { CollectionsCardsSkeleton } from "@/components/collections/collections-grid-skeleton";
import {
  DEFAULT_NUMBER_OF_NAMES_TO_IDEATE,
  DEFAULT_NUMBER_OF_NAMES_TO_SCRAMBLE,
  DEFAULT_NUMBER_OF_RELATED_COLLECTIONS,
  FromScrambleMethodToText,
  NameSuggestionsTabs,
} from "@/components/collections/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_SUGGESTIONS_TAB } from "@/components/providers";

const notoBlack = Noto_Emoji({ preload: false });
const DEFAULT_ITEMS_PER_PAGE = 20;

interface Collection {
  title: string;
  avatar_emoji: string;
  number_of_labels: number;
}

interface PagedCollections {
  suggestions: any[];
}

interface CollectionState {
  collection: Collection | null;
  collectionMembers: Record<number, PagedCollections | null>;
  relatedCollections: {
    related_collections: any[];
    other_collections: any[];
  } | null;
  scrambledNameIdeas: any[] | null;
  sampledNameIdeas: any[] | null;
}

interface NavigationConfig {
  itemsPerPage: number;
  totalItems: number | undefined;
}

interface LoadingState {
  collection: boolean;
  collectionMembers: boolean;
  scramble: boolean;
  ideate: boolean;
}

export const ExploreCollectionPage = ({ id }: { id: string }) => {
  const { params, setParams } = useQueryParams();

  const [loading, setLoading] = useState<LoadingState>({
    collection: true,
    collectionMembers: true,
    scramble: false,
    ideate: false,
  });

  const [collectionState, setCollectionState] = useState<CollectionState>({
    collection: null,
    collectionMembers: {},
    relatedCollections: null,
    scrambledNameIdeas: null,
    sampledNameIdeas: null,
  });

  const [navigationConfig, setNavigationConfig] = useState<NavigationConfig>({
    itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    totalItems: undefined,
  });

  const [scrambleMethod, setScrambleMethod] = useState<ScrambleMethod>(
    ScrambleMethod["left-right-shuffle-with-unigrams"],
  );

  const loadCollectionMembers = async () => {
    const currentPage = params.collectionDetails?.page || 1;
    if (collectionState.collectionMembers?.[currentPage]) {
      return;
    }

    setLoading((prev) => ({ ...prev, collectionMembers: true }));
    try {
      const res = await fetchCollectionMembers(id, {
        offset: (currentPage - 1) * navigationConfig.itemsPerPage,
        limit: navigationConfig.itemsPerPage,
      });

      if (res) {
        setCollectionState((prev) => ({
          ...prev,
          collectionMembers: {
            ...prev.collectionMembers,
            [currentPage]: { suggestions: res.suggestions },
          },
        }));
      }
    } catch (error) {
      setCollectionState((prev) => ({
        ...prev,
        collectionMembers: {
          ...prev.collectionMembers,
          [currentPage]: null,
        },
      }));
    } finally {
      setLoading((prev) => ({ ...prev, collectionMembers: false }));
    }
  };

  const loadCollectionInfo = async () => {
    if (!id) return;

    try {
      const [collection, related] = await Promise.all([
        getCollectionById(id),
        findCollectionsByCollection(id, DEFAULT_NUMBER_OF_RELATED_COLLECTIONS),
      ]);

      setCollectionState((prev) => ({
        ...prev,
        collection,
        relatedCollections: related,
      }));
    } catch (error) {
      setCollectionState((prev) => ({
        ...prev,
        collection: null,
        relatedCollections: null,
      }));
    } finally {
      setLoading((prev) => ({ ...prev, collection: false }));
    }
  };

  const handleScramble = async () => {
    if (!id) return;

    setLoading((prev) => ({ ...prev, scramble: true }));
    try {
      const randomSeed = Math.floor(Math.random() * 10);
      const ideas = await scrambleNamesByCollectionId(id, {
        seed: randomSeed,
        method: scrambleMethod,
      });
      setCollectionState((prev) => ({ ...prev, scrambledNameIdeas: ideas }));
    } catch (error) {
      setCollectionState((prev) => ({ ...prev, scrambledNameIdeas: null }));
    } finally {
      setLoading((prev) => ({ ...prev, scramble: false }));
    }
  };

  const handleIdeate = async () => {
    if (!id) return;

    setLoading((prev) => ({ ...prev, ideate: true }));
    try {
      const randomSeed = Math.floor(Math.random() * 10);
      const ideas = await sampleNamesByCollectionId(id, { seed: randomSeed });
      setCollectionState((prev) => ({ ...prev, sampledNameIdeas: ideas }));
    } catch (error) {
      setCollectionState((prev) => ({ ...prev, sampledNameIdeas: null }));
    } finally {
      setLoading((prev) => ({ ...prev, ideate: false }));
    }
  };

  useEffect(() => {
    loadCollectionInfo();
  }, [id]);

  useEffect(() => {
    loadCollectionMembers();
  }, [params.collectionDetails?.page]);

  useEffect(() => {
    setNavigationConfig((prev) => ({
      ...prev,
      totalItems: collectionState.collection?.number_of_labels,
    }));
  }, [collectionState.collection]);

  const [currentTab, setCurrentTab] = useState<NameSuggestionsTabs>(
    DEFAULT_SUGGESTIONS_TAB as NameSuggestionsTabs,
  );

  useEffect(() => {
    if (currentTab === (NameSuggestionsTabs.Sample as NameSuggestionsTabs)) {
      if (!collectionState.sampledNameIdeas) {
        handleIdeate();
      }
    } else if (
      currentTab === (NameSuggestionsTabs.Scramble as NameSuggestionsTabs)
    ) {
      if (!collectionState.scrambledNameIdeas) {
        handleScramble();
      }
    }
  }, [currentTab]);

  return (
    <div className="mx-auto py-8 w-full">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex space-x-4 mb-8">
          <div className="group-hover:bg-gray-300 group-hover:transition flex justify-center items-center rounded-md bg-background h-[72px] w-[72px] bg-gray-100 border border-gray-100">
            {loading.collection ? (
              <Skeleton className="h-[72px] w-[72px] rounded-md" />
            ) : (
              <div className="relative flex items-center justify-center overflow-hidden">
                <p className={`text-3xl ${notoBlack.className}`}>
                  {collectionState.collection?.avatar_emoji}
                </p>
              </div>
            )}
          </div>
          <div>
            {loading.collection ? (
              <>
                <Skeleton className="w-40 h-8 mb-2" />
                <Skeleton className="w-32 h-3 mb-2" />
                <Skeleton className="w-32 h-3" />
              </>
            ) : (
              <>
                <div className="text-3xl font-semibold">
                  {collectionState.collection?.title}
                </div>
                <div className="text-xs mb-1">by namegraph.dev</div>
                <div className="text-xs text-gray-400">Collection ID: {id}</div>
              </>
            )}
          </div>
        </div>

        <div className="flex">
          <div className="w-full">
            <div className="w-full flex flex-col space-y-8">
              <div className="w-full md:flex md:gap-8">
                <div className="w-full md:w-1/2 flex flex-col space-y-4">
                  <Tabs
                    className="p-3 rounded-xl border border-gray-200"
                    defaultValue={currentTab}
                    value={currentTab}
                  >
                    <div className="flex justify-between flex-col space-y-4 md:space-y-0 md:flex-row">
                      <TabsList className="w-max">
                        {Object.entries(NameSuggestionsTabs).map(([key]) => (
                          <TabsTrigger
                            key={key}
                            value={key}
                            onClick={() =>
                              setCurrentTab(key as NameSuggestionsTabs)
                            }
                          >
                            {key}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>

                    {Object.entries(NameSuggestionsTabs).map(([key]) => (
                      <TabsContent key={key} value={key} className="w-full">
                        {key === NameSuggestionsTabs.Names ? (
                          <NameSuggestionsTable
                            params={params}
                            loading={loading}
                            setParams={setParams}
                            collectionState={collectionState}
                            navigationConfig={navigationConfig}
                          />
                        ) : key === NameSuggestionsTabs.Sample ? (
                          <div className="w-full h-full">
                            <div className="flex justify-between items-center">
                              <p className="text-lg font-semibold mr-2.5">
                                Sample names
                              </p>
                              <Button onClick={handleIdeate}>Sample</Button>
                            </div>
                            <div className="pt-5 h-full">
                              <NameSuggestionsList
                                numberOfSkeletons={
                                  DEFAULT_NUMBER_OF_NAMES_TO_IDEATE
                                }
                                suggestions={collectionState.sampledNameIdeas}
                                loading={loading.ideate}
                              />
                            </div>
                          </div>
                        ) : key === NameSuggestionsTabs.Scramble ? (
                          <div className="w-full h-full">
                            <div className="flex justify-between items-start lg:items-center">
                              <p className="text-lg font-semibold w-max">
                                Scramble names
                              </p>
                              <div className="flex flex-col lg:flex-row items-end gap-2">
                                <div className="order-2 lg:order-1">
                                  <ScrambleMethodSelector
                                    scrambleMethod={scrambleMethod}
                                    setScrambleMethod={setScrambleMethod}
                                  />
                                </div>
                                <div className="order-1 lg:order-2">
                                  <Button onClick={handleScramble}>
                                    Scramble
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="pt-5 h-full">
                              <NameSuggestionsList
                                suggestions={collectionState.scrambledNameIdeas}
                                numberOfSkeletons={
                                  DEFAULT_NUMBER_OF_NAMES_TO_SCRAMBLE
                                }
                                loading={loading.scramble}
                              />
                            </div>
                          </div>
                        ) : null}
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
                <div className="w-full md:w-1/2 flex flex-col space-y-8 mt-8">
                  <div className="rounded-md w-full h-fit">
                    <h2 className="flex items-center text-lg font-semibold h-[47px] px-5 border-b border-gray-200">
                      Related collections
                    </h2>
                    <div className="px-5 pt-3 space-y-3">
                      {loading.collection ? (
                        <div className="pb-[2px] overflow-hidden">
                          <CollectionsCardsSkeleton
                            number={DEFAULT_NUMBER_OF_RELATED_COLLECTIONS}
                            className="space-y-[14px]"
                          />
                        </div>
                      ) : collectionState.relatedCollections
                          ?.related_collections.length ? (
                        collectionState.relatedCollections.related_collections.map(
                          (collection) => (
                            <CollectionCard
                              key={collection.collection_id}
                              collection={collection}
                            />
                          ),
                        )
                      ) : (
                        <div className="p-3">No related collections found</div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-md w-full h-fit">
                    <h2 className="flex items-center text-lg font-semibold h-[47px] px-5 border-b border-gray-200">
                      Other collections
                    </h2>
                    <div className="px-5 pt-3 space-y-3">
                      {loading.collection ? (
                        <div className="pb-[2px] overflow-hidden">
                          <CollectionsCardsSkeleton
                            number={3}
                            className="space-y-[14px]"
                          />
                        </div>
                      ) : collectionState.relatedCollections?.other_collections
                          .length ? (
                        collectionState.relatedCollections.other_collections.map(
                          (collection) => (
                            <CollectionCard
                              key={collection.collection_id}
                              collection={collection}
                            />
                          ),
                        )
                      ) : (
                        <div className="p-3">No other collections found</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NameSuggestionsTable = ({
  params,
  setParams,
  collectionState,
  navigationConfig,
  loading,
}: {
  params: QueryParams;
  setParams: (
    updates: Partial<QueryParams>,
    options?: { replace?: boolean },
  ) => void;
  collectionState: CollectionState;
  navigationConfig: NavigationConfig;
  loading: LoadingState;
}) => {
  const isFirstPage = () => Number(params.collectionDetails?.page || 1) === 1;
  const isLastPage = () => {
    if (!navigationConfig.totalItems) return false;
    const currentPage = Number(params.collectionDetails?.page || 1);
    return (
      currentPage * navigationConfig.itemsPerPage >= navigationConfig.totalItems
    );
  };

  const getPageGuide = () => {
    if (!navigationConfig.totalItems) return "No name suggestions found";

    const currentPage = Number(params.collectionDetails?.page || 1);
    const start = (currentPage - 1) * navigationConfig.itemsPerPage + 1;
    const end = Math.min(
      currentPage * navigationConfig.itemsPerPage,
      navigationConfig.totalItems,
    );
    return `${start}-${end} of ${navigationConfig.totalItems} name suggestions`;
  };

  const handlePageChange = (page: number) => {
    setParams({
      ...params,
      collectionDetails: { ...params.collectionDetails, page },
    });
  };

  return (
    <>
      {/** Collection name suggestions */}
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-semibold mr-2.5">
          {loading.collection ? (
            <Skeleton className="w-60 h-6 my-1" />
          ) : (
            getPageGuide()
          )}
        </div>
        <div className="flex">
          <Button
            className="cursor-pointer p-[9px] bg-white shadow-none hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:hover:bg-white"
            disabled={isFirstPage() || !navigationConfig.totalItems}
            onClick={() =>
              handlePageChange(Number(params.collectionDetails?.page || 1) - 1)
            }
          >
            <ChevronLeft className="w-6 h-6 text-black" />
          </Button>
          <Button
            className="cursor-pointer p-[9px] bg-white shadow-none hover:bg-gray-50 rounded-lg disabled:opacity-50"
            disabled={isLastPage() || !navigationConfig.totalItems}
            onClick={() =>
              handlePageChange(Number(params.collectionDetails?.page || 1) + 1)
            }
          >
            <ChevronRight className="w-6 h-6 text-black" />
          </Button>
        </div>
      </div>

      <div className="h-full">
        <NameSuggestionsList
          suggestions={
            collectionState.collectionMembers?.[
              params.collectionDetails?.page || 1
            ]?.suggestions
          }
          loading={loading.collectionMembers}
        />
      </div>

      <div className="flex items-center justify-between border border-gray-200 border-l-0 border-r-0 border-b-0 mt-3 p-3">
        <div className="text-sm text-gray-500 mr-2.5">
          {loading.collection ? (
            <Skeleton className="w-48 h-8" />
          ) : (
            getPageGuide()
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-white text-black shadow-none hover:bg-gray-50 text-sm p-2.5"
            disabled={isFirstPage() || !navigationConfig.totalItems}
            onClick={() =>
              handlePageChange(Number(params.collectionDetails?.page || 1) - 1)
            }
          >
            <ChevronLeft />
            Prev
          </Button>
          <Button
            className="bg-white text-black shadow-none hover:bg-gray-50 text-sm p-2.5"
            disabled={isLastPage() || !navigationConfig.totalItems}
            onClick={() =>
              handlePageChange(Number(params.collectionDetails?.page || 1) + 1)
            }
          >
            Next
            <ChevronRight />
          </Button>
        </div>
      </div>
    </>
  );
};

const ScrambleMethodSelector = ({
  scrambleMethod,
  setScrambleMethod,
}: {
  scrambleMethod: ScrambleMethod;
  setScrambleMethod: (_: ScrambleMethod) => void;
}) => {
  return (
    <Select
      defaultValue={scrambleMethod}
      onValueChange={(value) => setScrambleMethod(value as ScrambleMethod)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Scramble method" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(FromScrambleMethodToText).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
