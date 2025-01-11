"use client";

import {
  fetchCollectionMembers,
  findCollectionsByCollection,
  getCollectionById,
  sampleNamesByCollectionId,
  scrambleNamesByCollectionId,
} from "@/lib/utils";
import {
  NameGraphCollection,
  NameGraphFindCollectionsResponse,
  NameGraphSuggestion,
} from "@namehash/namegraph-sdk/utils";
import { useEffect, useState } from "react";
import { Noto_Emoji } from "next/font/google";
import { useQueryParams } from "@/components/use-query-params";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import Skeleton from "@/components/skeleton";

const notoBlack = Noto_Emoji({ preload: false });

interface NavigationConfig {
  itemsPerPage: number;
  totalItems?: number;
}

interface SuggestionsData {
  suggestions: NameGraphSuggestion[];
}

export const ExploreCollectionPage = ({ id }: { id: string }) => {
  const [loadingCollection, setLoadingCollection] = useState(true);
  const [loadingCollectionMembers, setLoadingCollectionMembers] =
    useState(true);
  const [loadingScramble, setLoadingScramble] = useState(false);
  const [loadingIdeate, setLoadingIdeate] = useState(false);

  /**
   * undefined: when query was never done
   * null: when query was done but resulted in error
   * NameGraphCollection: when query was successfully done
   */
  const [collection, setCollection] = useState<
    undefined | null | NameGraphCollection
  >(undefined);
  /**
   * collection names state:
   *
   * undefined is set when component never tried querying collections
   * null is set when no name suggestions were retrieved from NameGraph SDK for current collection id
   */
  const [collectionMembers, setCollectionMembers] = useState<
    undefined | null | Record<number, SuggestionsData | null | undefined>
  >(undefined);
  /**
   * undefined: when query was never done
   * null: when query was done but resulted in error
   * NameGraphFindCollectionsResponse: when query was successfully done
   */
  const [relatedCollections, setRelatedCollections] = useState<
    undefined | null | NameGraphFindCollectionsResponse
  >(undefined);
  /**
   * undefined: when query was never done
   * null: when query was done but resulted in error
   * NameGraphSuggestion: when query was successfully done
   */
  const [scrambledNameIdeas, setScrambledNameIdeas] = useState<
    undefined | null | NameGraphSuggestion[]
  >(undefined);
  /**
   * undefined: when query was never done
   * null: when query was done but resulted in error
   * NameGraphSuggestion: when query was successfully done
   */
  const [sampledNameIdeas, setSampledNameIdeas] = useState<
    undefined | null | NameGraphSuggestion[]
  >(undefined);

  useEffect(() => {
    loadCollectionInfo();
    loadCollectionMembers();
    loadCollectionRelatedCollections();
  }, [id]);
  useEffect(() => {
    console.log(collectionMembers);
  }, [collectionMembers]);

  const loadCollectionMembers = () => {
    if (!!collectionMembers?.[params.page]) {
      return;
    }

    setLoadingCollectionMembers(true);
    fetchCollectionMembers(id, {
      offset: params.page - 1,
    })
      .then((res) => {
        if (res) {
          const suggestions = res.suggestions;

          setCollectionMembers({
            ...collectionMembers,
            [params.page]: {
              suggestions,
            },
          });
        } else {
          setCollectionMembers({
            ...collectionMembers,
            [params.page]: null,
          });
        }
      })
      .catch(() => {
        setCollectionMembers({
          ...collectionMembers,
          [params.page]: null,
        });
      })
      .finally(() => setLoadingCollectionMembers(false));
  };

  const loadCollectionInfo = () => {
    if (id) {
      setLoadingCollection(true);
      getCollectionById(id)
        .then((res) => {
          setCollection(res);
        })
        .catch(() => {
          setCollection(null);
        })
        .finally(() => {
          setLoadingCollection(false);
        });
    }
  };

  const loadCollectionRelatedCollections = () => {
    if (id) {
      setLoadingCollection(true);
      findCollectionsByCollection(id)
        .then((res) => {
          setRelatedCollections(res);
        })
        .catch(() => {
          setRelatedCollections(null);
        })
        .finally(() => {
          setLoadingCollection(false);
        });
    }
  };

  const scramble = () => {
    if (id) {
      const randomSeed = Number(Number(Math.random() * 10).toFixed(0));

      setLoadingScramble(true);
      scrambleNamesByCollectionId(id, { seed: randomSeed })
        .then((res) => {
          setScrambledNameIdeas(res);
        })
        .catch(() => {
          setScrambledNameIdeas(null);
        })
        .finally(() => {
          setLoadingScramble(false);
        });
    }
  };

  const ideate = () => {
    if (id) {
      const randomSeed = Number(Number(Math.random() * 10).toFixed(0));

      setLoadingIdeate(true);
      sampleNamesByCollectionId(id, { seed: randomSeed })
        .then((res) => {
          setSampledNameIdeas(res);
        })
        .catch(() => {
          setSampledNameIdeas(null);
        })
        .finally(() => {
          setLoadingIdeate(false);
        });
    }
  };

  /**
   * Table query
   */
  const DEFAULT_PAGE_NUMBER = 1;
  const DEFAULT_COLLECTIONS_PARAMS: Record<string, any> = {
    page: DEFAULT_PAGE_NUMBER,
  };
  type DefaultDomainFiltersType = typeof DEFAULT_COLLECTIONS_PARAMS;
  const { params, setParams } = useQueryParams<DefaultDomainFiltersType>(
    DEFAULT_COLLECTIONS_PARAMS,
  );

  const handlePageChange = (page: number) => {
    setParams({ page });
  };

  /**
   * Navigation helper functions
   */
  const DEFAULT_ITEMS_PER_PAGE = 20;
  const [navigationConfig, setNavigationConfig] = useState<NavigationConfig>({
    itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    totalItems: undefined,
  });
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
        )} of ${navigationConfig.totalItems} name suggestions`
      : "No name suggestions found";
  };

  useEffect(() => {
    loadCollectionMembers();
  }, [params.page]);

  useEffect(() => {
    setNavigationConfig({
      ...navigationConfig,
      totalItems: collection?.number_of_names || undefined,
    });
  }, [collection]);

  return (
    <div className="mx-auto py-8 w-full">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex space-x-4 mb-8">
          <div
            style={{
              border: "1px solid rgba(0, 0, 0, 0.05)",
            }}
            className="group-hover:bg-gray-300 group-hover:transition flex justify-center items-center rounded-md bg-background h-[72px] w-[72px] bg-gray-100"
          >
            <div className="relative flex items-center justify-center overflow-hidden">
              <p className={`text-3xl ${notoBlack.className}`}>
                {collection?.avatar_emoji}
              </p>
            </div>
          </div>
          <div>
            <div className="text-3xl font-semibold mb-4">
              {collection ? (
                collection.title
              ) : (
                <Skeleton className="w-40 h-8" />
              )}
            </div>
            <div className="text-xs">Collection ID: {id}</div>
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="w-full">
            {/* Collections List */}
            <div className="w-full space-y-4">
              {loadingCollection ? (
                <div className="flex flex-col space-y-7 my-8">
                  <Loader />
                </div>
              ) : collection ? (
                <div>
                  <div className="w-full flex flex-col xl:flex-row space-y-8 xl:space-x-8 xl:space-y-0">
                    <div className="w-full">
                      <div className="w-full mb-8">
                        <div className="w-full flex flex-col space-y-4 p-3 rounded-xl border border-gray-200">
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
                                        handlePageChange(
                                          Number(params.page) - 1,
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
                                          Number(params.page) + 1,
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
                            <div className="w-full max-w-[756px] space-y-4">
                              {loadingCollectionMembers ? (
                                <div className="flex flex-col space-y-7 my-8">
                                  <Loader />
                                </div>
                              ) : collectionMembers ? (
                                collectionMembers[params.page]?.suggestions.map(
                                  (suggestion) => (
                                    <div
                                      key={suggestion.name}
                                      className="bg-gray-100 rounded-full groupp-2 px-4 flex items-start"
                                    >
                                      <div className="relative flex items-center justify-center overflow-hidden">
                                        {suggestion.name}
                                      </div>
                                    </div>
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
                                      handlePageChange(Number(params.page) - 1)
                                    }
                                  >
                                    <ChevronLeft />
                                    Prev
                                  </Button>
                                  <Button
                                    className="bg-white text-black shadow-none hover:bg-gray-50 text-sm p-2.5"
                                    disabled={isLastCollectionsPageForCurrentQuery()}
                                    onClick={() =>
                                      handlePageChange(Number(params.page) + 1)
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
                      <div className="border border-gray-200 rounded-lg p-3">
                        <div className="flex flex-col space-y-4">
                          <p className="font-semibold text-lg">
                            Interact with this collection
                          </p>
                          <div className="flex space-x-4">
                            <Button onClick={scramble}>
                              Scramble name ideas
                            </Button>

                            <Button onClick={ideate}>Sample name ideas</Button>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-8 mt-4">
                          {scrambledNameIdeas ? (
                            <div className="flex flex-col border border-gray-200 rounded-xl p-3">
                              <div className="text-lg underline font-semibold mb-4 pl-2">
                                Scrambled name ideas
                              </div>
                              {loadingScramble ? (
                                <Loader />
                              ) : (
                                <div className="flex flex-wrap gap-3">
                                  {scrambledNameIdeas?.map((suggestion) => {
                                    return (
                                      <div
                                        key={suggestion.name}
                                        className="bg-gray-100 rounded-full groupp-2 px-4 flex items-start"
                                      >
                                        <div className="relative flex items-center justify-center overflow-hidden">
                                          {suggestion.name}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ) : null}

                          {sampledNameIdeas ? (
                            <div className="flex flex-col border border-gray-200 rounded-xl p-3">
                              <div className="text-lg underline font-semibold mb-4 pl-2">
                                Sampled name ideas
                              </div>
                              {loadingIdeate ? (
                                <Loader />
                              ) : (
                                <div className="flex flex-wrap gap-3">
                                  {sampledNameIdeas?.map((suggestion) => {
                                    return (
                                      <div
                                        key={suggestion.name}
                                        className="bg-gray-100 rounded-full groupp-2 px-4 flex items-start"
                                      >
                                        <div className="relative flex items-center justify-center overflow-hidden">
                                          {suggestion.name}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="xl:w-1/2 w-full flex flex-col space-y-4">
                      <div className="border rounded-md border-gray-200 w-full h-fit">
                        <h2 className="flex items-center text-lg font-semibold h-[47px] px-5 border border-t-0 border-r-0 border-l-0 border-gray-200">
                          Related collections
                        </h2>
                        {relatedCollections ? (
                          relatedCollections.related_collections.map(
                            (collection) => (
                              <div
                                key={collection.collection_id}
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
                              </div>
                            ),
                          )
                        ) : (
                          <div className="p-3 px-5">
                            No name suggestions found
                          </div>
                        )}
                      </div>
                      <div className="z-40 border rounded-md border-gray-200 w-full h-fit">
                        <h2 className="flex items-center text-lg font-semibold h-[47px] px-5 border border-t-0 border-r-0 border-l-0 border-gray-200">
                          Other collections
                        </h2>
                        {relatedCollections ? (
                          relatedCollections.other_collections.map(
                            (collection) => (
                              <div
                                key={collection.collection_id}
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
                              </div>
                            ),
                          )
                        ) : (
                          <div className="p-3 px-5">
                            No name suggestions found
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="flex flex-col space-y-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
