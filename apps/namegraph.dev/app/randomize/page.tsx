"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import { Button } from "@namehash/namekit-react";
import {
  getCollectionsForQuery,
  sampleNamesByCollectionId,
  scrambleNamesByCollectionId,
} from "@/lib/utils";
import { DebounceInput } from "react-debounce-input";
import {
  NameGraphFetchTopCollectionMembersResponse,
  NameGraphGroupedByCategoryResponse,
  NameGraphSuggestion,
} from "@namehash/namegraph-sdk/utils";
import { TruncatedText } from "@namehash/namekit-react/client";

export default function RandomizePage() {
  const [suggestions, setSuggestions] = useState<
    NameGraphGroupedByCategoryResponse | undefined
  >(undefined);

  const [sampledSuggestions, setSampledSuggestions] = useState<
    NameGraphSuggestion[] | undefined
  >(undefined);

  const [scrambledSuggestions, setScrambledSuggestions] = useState<
    NameGraphSuggestion[] | undefined
  >(undefined);

  const suggest = () => {
    setError(false);
    setSelectedCollection(undefined);
    setSampledSuggestions(undefined);
    setScrambledSuggestions(undefined);

    let query = debouncedValue;
    if (debouncedValue.includes(".")) {
      query = debouncedValue.split(".")[0];
    }

    setSuggestions(undefined);
    getCollectionsForQuery(query)
      .then((res) => setSuggestions(res))
      .catch(() => setError(true));
  };

  const sample = () => {
    setError(false);

    if (!selectedCollection?.collection_id) {
      setError(true);
      throw new Error("Selected collection has no collection ID");
    }

    setSampledSuggestions(undefined);
    sampleNamesByCollectionId(selectedCollection.collection_id)
      .then((res) => setSampledSuggestions(res))
      .catch(() => setError(true));
  };

  const scramble = () => {
    setError(false);

    if (!selectedCollection?.collection_id) {
      setError(true);
      throw new Error("Selected collection has no collection ID");
    }

    setScrambledSuggestions(undefined);
    scrambleNamesByCollectionId(selectedCollection.collection_id)
      .then((res) => setScrambledSuggestions(res))
      .catch(() => setError(true));
  };

  const [debouncedValue, setDebouncedValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (debouncedValue) {
      suggest();
    } else {
      setSuggestions(undefined);
      setError(false);
    }
  }, [debouncedValue]);

  const [selectedCollection, setSelectedCollection] = useState<
    NameGraphFetchTopCollectionMembersResponse | undefined
  >(undefined);

  useEffect(() => {
    setSampledSuggestions(undefined);
    setScrambledSuggestions(undefined);
  }, [selectedCollection]);

  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      <h1 className="text-xl font-semibold mt-4 mb-8 text-center">
        🌪️ Query something to start the brainstorm 🧠
      </h1>
      <DebounceInput
        id="query"
        type="text"
        name="query"
        autoComplete="off"
        debounceTimeout={300}
        onChange={(e) => setDebouncedValue(e.target.value)}
        className="w-[80%] bg-gray-100 border border-gray-300 rounded-md p-3 px-4"
      />

      {error ? (
        <p className="underline text-red-400 text-xs mx-auto text-center pt-6">
          Please try again shortly, we had a network error while executing your
          request.
        </p>
      ) : suggestions?.categories.length ? (
        <>
          {debouncedValue && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mt-4 mb-8 text-center">
                🕸️ Select the collection you want to focus on 🔀
              </h3>
              <div className="flex flex-wrap gap-2 items-center max-w-3xl justify-center">
                {suggestions?.categories
                  ? suggestions?.categories.map((category) => {
                      return (
                        <>
                          {category.collection_id ? (
                            <Button
                              variant={
                                selectedCollection?.name === category.name
                                  ? "primary"
                                  : "ghost"
                              }
                              key={category.name}
                              onClick={() => setSelectedCollection(category)}
                            >
                              {category.name}
                            </Button>
                          ) : null}
                        </>
                      );
                    })
                  : null}
              </div>
            </div>
          )}
          {selectedCollection && (
            <div className="w-full flex flex-col lg:flex-row gap-8 mt-16">
              <div className="lg:w-1/3 max-w-3xl mx-auto px-4 text-center min-w-[180px] flex flex-col items-center">
                <h1 className="text-center text-xl font-semibold mb-4">
                  🎰 Generated names 🎰
                </h1>
                {suggestions?.categories.length && (
                  <div className="flex flex-col items-center">
                    <div className="flex flex-wrap gap-2 justify-center">
                      <div className="w-full mt-8 mb-12">
                        <div className="flex flex-col space-y-3 flex-wrap gap-2 justify-center">
                          {suggestions.categories
                            .find(
                              (collection) =>
                                collection.name === selectedCollection.name,
                            )
                            ?.suggestions.map((suggestion, i) => (
                              <TruncatedText
                                maxDisplayWidth={180}
                                key={i}
                                text={suggestion.name}
                              />
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="lg:w-1/3 max-w-3xl mx-auto px-4 text-center min-w-[180px] flex flex-col items-center">
                  <h1 className="text-center text-xl font-semibold mb-4 w-max">
                    🃏 Sampled names 🃏
                  </h1>
                  {selectedCollection ? (
                    <Button
                      variant="secondary"
                      className="mt-8"
                      onClick={sample}
                    >
                      Sample
                    </Button>
                  ) : null}
                  <div className="flex flex-col items-center">
                    <div className="flex flex-wrap gap-2 justify-center">
                      <div className="w-full mt-8 mb-12">
                        <div className="flex flex-col space-y-3 flex-wrap gap-2 justify-center">
                          {sampledSuggestions?.map((suggestion, i) => (
                            <TruncatedText
                              maxDisplayWidth={180}
                              key={i}
                              text={suggestion.name}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="lg:w-1/3 max-w-3xl mx-auto px-4 text-center min-w-[180px] flex flex-col items-center">
                  <h1 className="text-center text-xl font-semibold mb-4 w-max">
                    🥣 Scramble names 🥣
                  </h1>
                  {selectedCollection ? (
                    <Button
                      variant="secondary"
                      className="mt-8"
                      onClick={scramble}
                    >
                      Scramble
                    </Button>
                  ) : null}
                  <div className="flex flex-col items-center">
                    <div className="flex flex-wrap gap-2 justify-center">
                      <div className="w-full mt-8 mb-12">
                        <div className="flex flex-col space-y-3 flex-wrap gap-2 justify-center">
                          {scrambledSuggestions?.map((suggestion, i) => (
                            <TruncatedText
                              maxDisplayWidth={180}
                              key={i}
                              text={suggestion.name}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
