"use client";

import {
  getCollectionById,
  sampleNamesByCollectionId,
  scrambleNamesByCollectionId,
} from "@/lib/utils";
import {
  NameGraphCollection,
  NameGraphSuggestion,
} from "@namehash/namegraph-sdk/utils";
import { useEffect, useState } from "react";
import { Noto_Emoji } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

const notoBlack = Noto_Emoji({ preload: false });

export const ExploreCollectionPage = ({ id }: { id: string }) => {
  const [loadingCollection, setLoadingCollection] = useState(true);
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
  const [ideatedNameIdeas, setIdeatedNameIdeas] = useState<
    undefined | null | NameGraphSuggestion[]
  >(undefined);

  useEffect(() => {
    if (id) {
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
  }, [id]);

  const scramble = () => {
    if (id) {
      scrambleNamesByCollectionId(id)
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
      sampleNamesByCollectionId(id)
        .then((res) => {
          setIdeatedNameIdeas(res);
        })
        .catch(() => {
          setIdeatedNameIdeas(null);
        })
        .finally(() => {
          setLoadingIdeate(false);
        });
    }
  };

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
              {collection?.title}
            </div>
            <div>ID: {id}</div>
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="w-full">
            {/* Collections List */}
            <div className="w-full max-w-[756px] space-y-4">
              {loadingCollection ? (
                <div className="flex flex-col space-y-7 my-8">
                  <div>skeletons</div>
                </div>
              ) : collection ? (
                <div className="flex flex-col space-y-4">
                  <div className="flex space-x-4 ml-auto">
                    {!scrambledNameIdeas ? (
                      <Button onClick={scramble}>Scramble</Button>
                    ) : null}

                    {!ideatedNameIdeas ? (
                      <Button onClick={ideate}>Ideate</Button>
                    ) : null}
                  </div>
                  <div className="flex space-x-8">
                    <div className="flex flex-col">
                      <div className="text-xl font-semibold">Top names:</div>
                      {collection?.top_names.map((suggestion) => {
                        return (
                          <div
                            key={suggestion.namehash}
                            className="!no-underline group border border-l-0 border-r-0 border-b-0 pt-3 border-gray-200 flex items-start gap-[18px]"
                          >
                            <div className="relative flex items-center justify-center overflow-hidden">
                              {suggestion.name}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col">
                      <div className="text-xl font-semibold">
                        Scrambled names:
                      </div>
                      {loadingScramble ? <Loader /> : null}

                      {scrambledNameIdeas?.map((suggestion) => {
                        return (
                          <div
                            key={suggestion.name}
                            className="!no-underline group border border-l-0 border-r-0 border-b-0 pt-3 border-gray-200 flex items-start gap-[18px]"
                          >
                            <div className="relative flex items-center justify-center overflow-hidden">
                              {suggestion.name}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col">
                      <div className="text-xl font-semibold">
                        Ideated names:
                      </div>
                      {loadingIdeate ? <Loader /> : null}

                      {ideatedNameIdeas?.map((suggestion) => {
                        return (
                          <div
                            key={suggestion.name}
                            className="!no-underline group border border-l-0 border-r-0 border-b-0 pt-3 border-gray-200 flex items-start gap-[18px]"
                          >
                            <div className="relative flex items-center justify-center overflow-hidden">
                              {suggestion.name}
                            </div>
                          </div>
                        );
                      })}
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
