import { NameGraphCollection } from "@namehash/namegraph-sdk/utils";
import { Link } from "@namehash/namekit-react";
import { Noto_Emoji } from "next/font/google";
import { getNameDetailsPageHref } from "@/lib/utils";
import { NameWithCurrentTld, useQueryParams } from "../use-query-params";
import { DisplayedName } from "@namehash/nameguard-react";
import { buildENSName } from "@namehash/ens-utils";
import { MouseEvent } from "react";

const notoBlack = Noto_Emoji({ preload: false });

export const CollectionCard = ({
  collection,
}: {
  collection: NameGraphCollection;
}) => {
  const { params } = useQueryParams();

  /**
   * This function is necessary because there is different links
   * inside this component. It organizes links functionaly, on click.
   */
  const redirectLink = (e: MouseEvent, clickOnName = "") => {
    e.stopPropagation();

    if (clickOnName) {
      window.location.href = getNameDetailsPageHref(clickOnName);
    } else {
      window.location.href = `/collections/${collection.collection_id}`;
    }
  };

  return (
    <div className="group relative" key={collection.collection_id}>
      <div className="rounded-md border border-gray-200 group-hover:border-black">
        <button
          role="link"
          onClick={(e) => redirectLink(e)}
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
            <div className="w-full flex justify-between">
              <h3 className="!text-sm font-semibold truncate group-hover:underline">
                {collection.title}
              </h3>
              <p className="mr-3 text-sm font-light text-gray-500">
                {collection.number_of_labels} name
                {collection.number_of_labels !== 1 ? "s" : ""}
              </p>
            </div>
            <p className="text-xs text-gray-500 mb-2 truncate">
              by namegraph.eth
            </p>
            <div className="flex gap-2">
              {collection.top_labels.map((tag) => (
                <button
                  role="link"
                  key={tag.label}
                  onClick={(e) => redirectLink(e, tag.label)}
                  className="hover:underline max-h-[28px] w-max bg-gray-100 !text-sm px-2 py-1 bg-muted rounded-full"
                >
                  <DisplayedName
                    textStylingClasses="hover:cursor-pointer"
                    name={buildENSName(
                      NameWithCurrentTld({ name: tag.label, params }),
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        </button>
        <div className="z-40 rounded-md bg-gradient-white-to-transparent absolute right-[1px] bottom-0.5 w-40 h-[60px]"></div>
      </div>
    </div>
  );
};
