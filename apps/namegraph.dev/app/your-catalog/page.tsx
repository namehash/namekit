"use client";

import { useEffect } from "react";
import { useState } from "react";
import { writersBlockSuggestions } from "@/lib/writers-block-suggestions";
import {
  sampleWritersBlockSuggestions,
  WritersBlockCollection,
  WritersBlockSuggestion,
} from "@namehash/namegraph-sdk/utils";
import { WritersBlockPills } from "@/components/mini-apps/ideate/writers-block-pills";
import { Catalog } from "@/components/mini-apps/ideate/catalog";
import { Button } from "@/components/ui/button";

export default function IdeatePage() {
  const [suggestions, setSuggestions] = useState<WritersBlockSuggestion[]>([]);
  const [collectionsToConsider, setCollectionsToConsider] = useState<
    WritersBlockCollection[]
  >(writersBlockSuggestions);

  const ideate = (catalog: WritersBlockCollection[]) => {
    const wbSuggestions = sampleWritersBlockSuggestions(5, catalog);
    setSuggestions(wbSuggestions);
  };

  const onCatalogChange = (parsedJSON: any) => {
    setCollectionsToConsider(parsedJSON);
  };

  useEffect(() => {
    ideate(writersBlockSuggestions);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="max-w-3xl mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-semibold mb-4">
              Ideate over your own name ideas catalog:
            </h1>
            <p className="text-gray-500 mb-8">
              Edit the catalog in the right to constraint the results your users
              will receive.
            </p>
            <WritersBlockPills suggestions={suggestions} />
            <div className="mt-4">
              <Button onClick={() => ideate(collectionsToConsider)}>
                Ideate
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[600px]">
          <Catalog onJsonChange={onCatalogChange} />
        </div>
      </div>
    </div>
  );
}
