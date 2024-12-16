"use client";

import { WritersBlockPill } from "./writers-block-pill";
import { WritersBlockSuggestion } from "@/lib/utils";
import { Button } from "./ui/button";
import { useState } from "react";
import { useEffect } from "react";

interface WritersBlockPillsProps {
  suggestions: WritersBlockSuggestion[];
  onIdeate: () => void;
}

export function WritersBlockPills({
  suggestions,
  onIdeate,
}: WritersBlockPillsProps) {
  const [suggestionsToShow, setCollectionsToShow] = useState<
    WritersBlockSuggestion[]
  >([]);

  useEffect(() => {
    setCollectionsToShow(suggestions);
  }, [suggestions]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl font-semibold mb-4">Check out what&apos;s hot</h1>
      <p className="text-gray-500 mb-8">
        Check out some suggestions from the community.
        <br /> Edit the catalog in the right to constraint the results sampled.
      </p>
      {suggestionsToShow.length ? (
        <div className="flex flex-col space-y-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestionsToShow.map((suggestion, idx) => (
              <WritersBlockPill key={idx} suggestion={suggestion} />
            ))}
          </div>
          <div>
            <Button onClick={onIdeate}>Ideate</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
