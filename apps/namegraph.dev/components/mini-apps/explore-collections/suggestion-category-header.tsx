import Skeleton from "@/components/skeleton";
import { NameGraphFetchTopCollectionMembersResponse } from "@namehash/namegraph-sdk/utils";

interface SuggestionCategoryHeaderProps {
  category: NameGraphFetchTopCollectionMembersResponse | null;
}

export const SuggestionCategoryHeader = ({
  category,
}: SuggestionCategoryHeaderProps) => {
  return (
    <div className="flex flex-wrap lg:flex-nowrap pt-6 mb-3 gap-5">
      {category ? (
        <h3 className="w-full md:w-auto uppercase text-xs font-semibold text-gray-500 line-clamp-1 break-all">
          {category.name}
        </h3>
      ) : (
        <Skeleton />
      )}
    </div>
  );
};
