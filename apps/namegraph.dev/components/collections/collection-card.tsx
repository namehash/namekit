import { NameGraphCollection } from "@namehash/namegraph-sdk/utils";
import { Link } from "@namehash/namekit-react";
import { Noto_Emoji } from "next/font/google";

const notoBlack = Noto_Emoji({ preload: false });

export const CollectionCard = ({
  collection,
}: {
  collection: NameGraphCollection;
}) => {
  return (
    <Link
      key={collection.collection_id}
      href={`/collections/${collection.collection_id}`}
      className="!no-underline group rounded-lg py-3 cursor-pointer flex items-start space-x-[18px]"
    >
      <div
        style={{
          border: "1px solid rgba(0, 0, 0, 0.05)",
        }}
        className="group-hover:bg-gray-300 group-hover:transition flex justify-center items-center rounded-md bg-background h-[72px] w-[72px] bg-gray-100"
      >
        <div className="relative flex items-center justify-center overflow-hidden">
          <p className={`text-3xl ${notoBlack.className}`}>
            {collection.avatar_emoji}
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <h3 className="text-sm font-semibold truncate">{collection.title}</h3>
        <p className="text-xs text-gray-500 mb-2 truncate">
          by {collection.owner}
        </p>
        <div className="relative">
          <div className="flex gap-2">
            {collection.top_names.map((tag) => (
              <span
                key={tag.namehash}
                className="max-h-[28px] w-max bg-gray-100 text-sm px-2 py-1 bg-muted rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
          <div className="bg-gradient-white-to-transparent absolute right-0 top-0 w-40 h-full"></div>
        </div>
      </div>
    </Link>
  );
};
