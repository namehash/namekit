import { NameGraphCollection } from "@namehash/namegraph-sdk/utils";
import { Link } from "@namehash/namekit-react";
import { Noto_Emoji } from "next/font/google";
import { getNameDetailsPageHref } from "@/lib/utils";
import { NameWithCurrentTld, useQueryParams } from "../use-query-params";
import { DisplayedName } from "@namehash/nameguard-react";
import { buildENSName } from "@namehash/ens-utils";

const notoBlack = Noto_Emoji({ preload: false });

export const CollectionCard = ({
  collection,
}: {
  collection: NameGraphCollection;
}) => {
  const { params } = useQueryParams();

  return (
    <div 
      className="group"
      key={collection.collection_id}
    >
      <div
        className="!no-underline group-hover:bg-gray-50 transition rounded-lg py-3 flex items-start space-x-[18px] border border-gray-200"
      >
        <div
          style={{
            border: "1px solid rgba(0, 0, 0, 0.05)",
          }}
          className="ml-3 flex justify-center items-center rounded-md bg-background h-[72px] w-[72px] bg-gray-100"
        >
          <div className="relative flex items-center justify-center overflow-hidden">
            <p className={`text-3xl ${notoBlack.className}`}>
              {collection.avatar_emoji}
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <Link
            href={`/collections/${collection.collection_id}`}
            className="!text-sm font-semibold truncate"
          >
            {collection.title}
          </Link>
          <p className="text-xs text-gray-500 mb-2 truncate">
            by namegraph.eth
          </p>
          <div className="relative">
            <div className="flex gap-2">
              {collection.top_labels.map((tag) => (
                <Link
                  key={tag.label}
                  href={getNameDetailsPageHref(tag.label)}
                  className="max-h-[28px] w-max bg-gray-100 !text-sm px-2 py-1 bg-muted rounded-full"
                >
                  <DisplayedName
                    name={buildENSName(
                      NameWithCurrentTld({ name: tag.label, params }),
                    )}
                  />
                </Link>
              ))}
            </div>
            <div className="bg-gradient-white-to-transparent group-hover:bg-gradient-grayish-to-transparent absolute right-0 top-0 w-40 h-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
