"use client";

import { WritersBlockPills } from "../components/writers-block-pills";
import { Catalog } from "../components/catalog";
import { useEffect } from "react";
import { useState } from "react";
import { writersBlockSuggestions } from "@/lib/writers-block-suggestions";
import {
  sampleWritersBlockSuggestions,
  WritersBlockCollection,
  WritersBlockSuggestion,
} from "@namehash/namegraph-sdk/utils";

export default function Home() {
  const [suggestions, setSuggestions] = useState<WritersBlockSuggestion[]>([]);
  const [collectionsToConsider, setCollectionsToConsider] = useState<
    WritersBlockCollection[]
  >([]);

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
          <WritersBlockPills
            suggestions={suggestions}
            onIdeate={() => ideate(collectionsToConsider)}
          />
        </div>
        <div className="w-full lg:w-[600px]">
          <Catalog onJsonChange={onCatalogChange} />
        </div>
      </div>
    </div>
  );
}
