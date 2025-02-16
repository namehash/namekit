import { Link } from "@namehash/namekit-react";
import { NameGraphSuggestion } from "@namehash/namegraph-sdk/utils";
import { NftAvatar } from "@/components/nft-avatar/nft-avatar";
import { AvatarSize } from "@/components/nft-avatar/avatar-utils";
import { buildENSName } from "@namehash/ens-utils";
import { getNameDetailsPageHref } from "@/lib/utils";
import {
  NameWithCurrentTld,
  QueryParams,
  useQueryParams,
} from "../use-query-params";
import { DisplayedName } from "@namehash/nameguard-react";
import Skeleton from "@/components/skeleton";
import { DEFAULT_ITEMS_PER_PAGE } from "@/app/name/[name]/types";
import { useScreenSize } from "../nft-avatar/use-screen-size";
import { useState } from "react";

interface NameSuggestionsListProps {
  suggestions?: NameGraphSuggestion[] | null;
  loading?: boolean;
}

const GRID_ROWS = 5;
const GRID_COLUMNS = DEFAULT_ITEMS_PER_PAGE / GRID_ROWS;
const MAX_PILL_WIDTH = 150;
const PILL_HEIGHT = 40;

export const NameSuggestionsList = ({
  suggestions,
  loading,
}: NameSuggestionsListProps) => {
  const { params } = useQueryParams();
  const { isMobile, isTablet } = useScreenSize();

  const renderSkeletons = () => {
    return Array.from({ length: DEFAULT_ITEMS_PER_PAGE }).map((_, index) => (
      <div key={`skeleton-${index}`} className="w-full h-full">
        <Skeleton className="h-10 w-full rounded-[6px] pl-1 pr-3 py-1" />
      </div>
    ));
  };

  const renderSuggestions = () => {
    const paddedSuggestions = [
      ...(suggestions || []),
      ...Array(DEFAULT_ITEMS_PER_PAGE - (suggestions?.length || 0)).fill(null),
    ];

    return paddedSuggestions.map((suggestion, index) => {
      if (!suggestion) {
        return <div key={`empty-${index}`} className="w-full h-full" />;
      }

      return (
        <div key={`suggestion-${suggestion.label}-${index}`}>
          <NameSuggestion suggestion={suggestion} params={params} />
        </div>
      );
    });
  };

  if (!!suggestions && !suggestions.length && !loading) {
    return <div className="p-3">No name suggestions found</div>;
  }

  if (!suggestions && !loading) {
    return <div className="p-3">We invite you to click the button above</div>;
  }

  return (
    <div
      className="w-full h-full grid gap-3"
      style={{
        gridTemplateColumns: `repeat(${isMobile ? 1 : isTablet ? 2 : GRID_COLUMNS}, minmax(${MAX_PILL_WIDTH}px, 1fr))`,
        gridTemplateRows: `repeat(${GRID_ROWS}, ${PILL_HEIGHT}px)`,
        gridAutoFlow: "row",
        alignItems: "stretch",
      }}
    >
      {loading ? renderSkeletons() : renderSuggestions()}
    </div>
  );
};

const NameSuggestion = ({
  suggestion,
  params,
}: {
  suggestion: NameGraphSuggestion;
  params: QueryParams;
}) => {
  const [averageAvatarColor, setAverageAvatarColor] = useState("");
  const [doingAnimation, setDoingAnimation] = useState(false);

  const handleAnimation = () => {
    setDoingAnimation(true);

    setTimeout(() => {
      setDoingAnimation(false);
    }, 2000);
  };

  return (
    <Link
      key={suggestion.label}
      onMouseEnter={handleAnimation}
      href={getNameDetailsPageHref(suggestion.label)}
      className="relative overflow-hidden bg-gray-100 rounded-[6px] py-1 flex items-center w-full h-full pl-1 pr-3"
    >
      <div
        style={{
          background: averageAvatarColor,
          transform: `${doingAnimation ? "translateX(100%)" : "translateX(0%)"}`,
          transition: "transform 1.7s",
        }}
        className="w-full h-[80px] left-[-100%] absolute opacity-20 brightness-125"
      ></div>
      <div className="mr-2">
        <NftAvatar
          withLink={false}
          size={AvatarSize.MINI}
          name={buildENSName(
            NameWithCurrentTld({ name: suggestion.label, params }),
          )}
          onAverageColorDiscovery={(color) => setAverageAvatarColor(color)}
        />
      </div>
      <DisplayedName
        maxDisplayWidth={MAX_PILL_WIDTH}
        name={buildENSName(
          NameWithCurrentTld({ name: suggestion.label, params }),
        )}
      />
    </Link>
  );
};
