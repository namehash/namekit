"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
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
import { Tooltip } from "@namehash/namekit-react/client";
import Skeleton from "@/components/skeleton";
import { ScrambleMethod } from "@namehash/namegraph-sdk/utils";
import { useQueryParams } from "@/components/use-query-params";
import {
  fetchCollectionMembers,
  findCollectionsByCollection,
  getCollectionById,
  sampleNamesByCollectionId,
  scrambleNamesByCollectionId,
} from "@/lib/utils";
import { NameSuggestionsList } from "@/components/mini-apps/name-suggestions-list";
import { FromScrambleMethodToText } from "@/app/name/[name]/types";
import { CollectionsCardsSkeleton } from "@/components/collections/collections-grid-skeleton";

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
        findCollectionsByCollection(id),
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

  const handlePageChange = (page: number) => {
    setParams({
      ...params,
      collectionDetails: { ...params.collectionDetails, page },
    });
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
                <Skeleton className="w-40 h-8 mb-4" />
                <Skeleton className="w-32 h-4" />
              </>
            ) : (
              <>
                <div className="text-3xl font-semibold mb-4">
                  {collectionState.collection?.title}
                </div>
                <div className="text-xs">Collection ID: {id}</div>
              </>
            )}
          </div>
        </div>

        <div className="flex">
          <div className="w-full">
            <div className="w-full flex flex-col space-y-8">
              <div className="w-full">
                <div className="w-full mb-8">
                  <div className="w-full flex flex-col space-y-4 p-3 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-5">
                      <div className="text-lg font-semibold mr-2.5">
                        {loading.collection ? (
                          <Skeleton className="w-48 h-8" />
                        ) : (
                          getPageGuide()
                        )}
                      </div>
                      <div className="flex">
                        <Button
                          className="cursor-pointer p-[9px] bg-white shadow-none hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:hover:bg-white"
                          disabled={
                            isFirstPage() || !navigationConfig.totalItems
                          }
                          onClick={() =>
                            handlePageChange(
                              Number(params.collectionDetails?.page || 1) - 1,
                            )
                          }
                        >
                          <ChevronLeft className="w-6 h-6 text-black" />
                        </Button>
                        <Button
                          className="cursor-pointer p-[9px] bg-white shadow-none hover:bg-gray-50 rounded-lg disabled:opacity-50"
                          disabled={
                            isLastPage() || !navigationConfig.totalItems
                          }
                          onClick={() =>
                            handlePageChange(
                              Number(params.collectionDetails?.page || 1) + 1,
                            )
                          }
                        >
                          <ChevronRight className="w-6 h-6 text-black" />
                        </Button>
                      </div>
                    </div>

                    <div>
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
                          disabled={
                            isFirstPage() || !navigationConfig.totalItems
                          }
                          onClick={() =>
                            handlePageChange(
                              Number(params.collectionDetails?.page || 1) - 1,
                            )
                          }
                        >
                          <ChevronLeft />
                          Prev
                        </Button>
                        <Button
                          className="bg-white text-black shadow-none hover:bg-gray-50 text-sm p-2.5"
                          disabled={
                            isLastPage() || !navigationConfig.totalItems
                          }
                          onClick={() =>
                            handlePageChange(
                              Number(params.collectionDetails?.page || 1) + 1,
                            )
                          }
                        >
                          Next
                          <ChevronRight />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full border border-gray-200 rounded-lg">
                  <div className="flex border-b border-gray-200 px-3 py-3 justify-between items-center">
                    <Tooltip
                      trigger={
                        <p className="font-semibold text-lg">Sample names</p>
                      }
                    >
                      <p>Sample names from this collection</p>
                    </Tooltip>
                    <Button onClick={handleIdeate}>Sample name ideas</Button>
                  </div>
                  <div className="p-4">
                    <NameSuggestionsList
                      suggestions={collectionState.sampledNameIdeas}
                      loading={loading.ideate}
                    />
                  </div>
                </div>

                <div className="w-full border border-gray-200 rounded-lg mt-8">
                  <div className="flex border-b border-gray-200 px-3 py-3 justify-between items-center">
                    <Tooltip
                      trigger={
                        <p className="font-semibold text-lg">Scramble names</p>
                      }
                    >
                      <p>Generate new names by scrambling existing ones</p>
                    </Tooltip>
                    <div className="flex items-center gap-4">
                      <Select
                        defaultValue={scrambleMethod}
                        onValueChange={(value) =>
                          setScrambleMethod(value as ScrambleMethod)
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Scramble method" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(FromScrambleMethodToText).map(
                            ([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <Button onClick={handleScramble}>
                        Scramble name ideas
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <NameSuggestionsList
                      suggestions={collectionState.scrambledNameIdeas}
                      loading={loading.scramble}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col space-y-8">
                <div className="border rounded-md border-gray-200 w-full h-fit">
                  <h2 className="flex items-center text-lg font-semibold h-[47px] px-5 border-b border-gray-200">
                    Related collections
                  </h2>
                  <div className="px-5">
                    {loading.collection ? (
                      <div className="pb-[18px] space-y-3 overflow-hidden">
                        <CollectionsCardsSkeleton
                          number={3}
                          className="space-y-3"
                        />
                      </div>
                    ) : collectionState.relatedCollections?.related_collections
                        .length ? (
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

                <div className="border rounded-md border-gray-200 w-full h-fit">
                  <h2 className="flex items-center text-lg font-semibold h-[47px] px-5 border-b border-gray-200">
                    Other collections
                  </h2>
                  <div className="px-5">
                    {loading.collection ? (
                      <div className="pb-[18px] space-y-3 overflow-hidden">
                        <CollectionsCardsSkeleton
                          number={3}
                          className="space-y-3"
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
  );
};
