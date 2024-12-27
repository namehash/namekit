import { Button } from "../../ui/button";
import { WritersBlockSuggestion } from "@namehash/namegraph-sdk/utils";
import { WritersBlockPill } from "./writers-block-pill";

interface WritersBlockPillsProps {
  suggestions: WritersBlockSuggestion[];
  onIdeate: () => void;
}

export function WritersBlockPills({
  suggestions,
  onIdeate,
}: WritersBlockPillsProps) {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Check out what&apos;s hot</h1>
      <p className="text-gray-500 mb-8">
        Check out some suggestions from the community.
        <br /> Edit the catalog in the right to constraint the results sampled.
      </p>
      {suggestions.length ? (
        <div className="flex flex-col space-y-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((suggestion, idx) => (
              <WritersBlockPill key={idx} suggestion={suggestion} />
            ))}
          </div>
          <div>
            <Button onClick={onIdeate}>Ideate</Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
