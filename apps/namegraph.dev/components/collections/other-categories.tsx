import {
  NameGraphFetchTopCollectionMembersResponse,
  NameGraphSuggestion,
} from "@namehash/namegraph-sdk/utils";
import { NameWithCurrentTld, QueryParams } from "../use-query-params";
import { getNameDetailsPageHref } from "@/lib/utils";
import { Link } from "@namehash/namekit-react";

export const OtherCategories = ({
  otherCategories,
  params,
}: {
  otherCategories?: NameGraphFetchTopCollectionMembersResponse[];
  params: QueryParams;
}) => {
  return (
    <>
      {otherCategories && otherCategories.length > 0 && (
        <div className="mx-auto w-full">
          <div className="w-full rounded-lg border border-gray-200">
            <p className="text-[18px] font-semibold px-5 py-2.5 border-b border-gray-200">
              Explore other names
            </p>
            {otherCategories.map((collection) => (
              <div key={collection.collection_id}>
                <p className="py-3 px-5 font-semibold text-sm text-gray-500">
                  {collection.name}
                </p>
                <div className="flex flex-col">
                  {collection.suggestions
                    .slice(0, 3)
                    .map((suggestion: NameGraphSuggestion) => (
                      <Link
                        key={suggestion.label}
                        href={getNameDetailsPageHref(suggestion.label)}
                        className="p-5 border-t border-gray-200 font-semibold text-base text-black"
                      >
                        {NameWithCurrentTld({
                          name: suggestion.label,
                          params,
                        })}
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
