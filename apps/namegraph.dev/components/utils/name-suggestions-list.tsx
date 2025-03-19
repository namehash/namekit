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
import { useState } from "react";
import { DEFAULT_ITEMS_PER_PAGE } from "../collections/utils";

interface NameSuggestionsListProps {
  numberOfSkeletons?: number;
  suggestions?: NameGraphSuggestion[] | null;
  loading?: boolean;
}

const MAX_PILL_WIDTH = 250;

export const NameSuggestionsList = ({
  numberOfSkeletons = DEFAULT_ITEMS_PER_PAGE,
  suggestions,
  loading,
}: NameSuggestionsListProps) => {
  const { params } = useQueryParams();

  const renderSkeletons = () => {
    return Array.from({ length: numberOfSkeletons }).map((_, index) => (
      <div key={`skeleton-${index}`} className="w-full h-full">
        <Skeleton className="h-[56px] w-full rounded-[6px]" />
      </div>
    ));
  };

  const renderSuggestions = () => {
    const paddedSuggestions = [
      ...(suggestions || []),
      ...Array(numberOfSkeletons - (suggestions?.length || 0)).fill(null),
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
    return <>No name suggestions found</>;
  }

  if (!suggestions && !loading) {
    return <></>;
  }

  return (
    <div className="w-full h-full grid gap-3">
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
      <div className="mr-4">
        <NftAvatar
          withLink={false}
          size={AvatarSize.SMALL}
          name={buildENSName(
            NameWithCurrentTld({ name: suggestion.label, params }),
          )}
          onAverageColorDiscovery={(color) => setAverageAvatarColor(color)}
        />
      </div>
      <DisplayedName
        textStylingClasses="!text-lg"
        maxDisplayWidth={MAX_PILL_WIDTH}
        name={buildENSName(
          NameWithCurrentTld({ name: suggestion.label, params }),
        )}
      />
    </Link>
  );
};
