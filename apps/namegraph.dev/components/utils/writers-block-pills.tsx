import { WritersBlockSuggestion } from "@namehash/namegraph-sdk/utils";
import { WritersBlockPill } from "./writers-block-pill";

interface WritersBlockPillsProps {
  suggestions: WritersBlockSuggestion[];
}

export function WritersBlockPills({ suggestions }: WritersBlockPillsProps) {
  return (
    <>
      {suggestions.length ? (
        <div className="flex flex-col space-y-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((suggestion, idx) => (
              <WritersBlockPill key={idx} suggestion={suggestion} />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
