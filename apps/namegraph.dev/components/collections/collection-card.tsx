import { NameGraphCollection } from "@namehash/namegraph-sdk/utils";
import { Noto_Emoji } from "next/font/google";
import { formatNumber, getNameDetailsPageHref } from "@/lib/utils";
import { NameWithCurrentTld, useQueryParams } from "../use-query-params";
import { buildENSName } from "@namehash/ens-utils";
import { DisplayedName } from "@namehash/nameguard-react";
const notoBlack = Noto_Emoji({ preload: false });

export const CollectionCard = ({
  collection,
}: {
  collection: NameGraphCollection;
}) => {
  const { params } = useQueryParams();

  /**
   * This function is necessary because there is
   * different links inside this component.
   */
  const getLinkToPage = (name = "") => {
    if (!!name) {
      return getNameDetailsPageHref(name);
    } else {
      return `/collections/${collection.collection_id}`;
    }
  };

  return (
    <div className="group relative" key={collection.collection_id}>
      <div className="rounded-md border border-gray-200 group-hover:border-gray-400">
        <a
          href={getLinkToPage()}
          className="related !no-underline transition rounded-lg py-3 flex items-start space-x-[18px] w-full"
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
          <div className="flex-1 overflow-hidden flex flex-col items-start">
            <div className="w-full flex flex-col items-start mb-2 space-y-1">
              <div className="flex w-full justify-between">
                <h3 className="!text-sm font-semibold truncate w-full flex justify-between">
                  {collection.title}
                </h3>
                <p className="hidden md:block text-xs md:text-sm mr-3 font-light text-gray-500 min-w-max">
                  {formatNumber(collection.number_of_labels)} name
                  {collection.number_of_labels !== 1 ? "s" : ""}
                </p>
              </div>
              <p className="text-xs text-gray-500 truncate">by namegraph.eth</p>
              <p className="md:hidden text-xs mr-3 md:text-sm font-light text-gray-500">
                {formatNumber(collection.number_of_labels)} name
                {collection.number_of_labels !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-2">
              {collection.top_labels.map((tag) => (
                <a
                  key={tag.label}
                  href={getLinkToPage(tag.label)}
                  className="hover:underline max-h-[28px] w-max bg-gray-100 !text-sm px-2 py-1 bg-muted rounded-full"
                >
                  <DisplayedName
                    textStylingClasses="hover:cursor-pointer"
                    name={buildENSName(
                      NameWithCurrentTld({ name: tag.label, params }),
                    )}
                  />
                </a>
              ))}
            </div>
          </div>
        </a>
        <div className="pointer-events-none z-40 rounded-md bg-gradient-white-to-transparent absolute right-[1px] bottom-0.5 w-40 h-[60px]"></div>
      </div>
    </div>
  );
};
