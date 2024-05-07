import React from "react";
import { GraphemeGuardReport } from "@namehash/nameguard";

import { CheckIcon } from "../Report/CheckIcon";
import { useGraphemeModalStore } from "../../stores/grapheme";

type ConfusableListItemProps = {
  item: GraphemeGuardReport["confusables"][0];
};

export const ConfusableListItem = ({ item }: ConfusableListItemProps) => {
  const { openGraphemeModal } = useGraphemeModalStore();

  const handleClick = () => {
    openGraphemeModal(decodeURIComponent(item.grapheme));
  };

  return (
    <div
      className="grid grid-cols-8 md:grid-cols-12 gap-4 py-5 pl-6 cursor-pointer transition-colors hover:bg-gray-50 last:rounded-b-md"
      onClick={handleClick}
    >
      <div className="flex md:items-center justify-center">
        <p className="text-4xl text-black font-bold">{item.grapheme}</p>
      </div>
      <div className="md:grid md:grid-cols-7 md:gap-4 col-span-7 md:col-span-11">
        <div className="md:col-span-3">
          {item.is_canonical && (
            <div className="mb-1.5 -mt-4 relative text-green-800 text-xs font-medium rounded-full px-2 py-0.5 bg-green-100 inline-block">
              Canonical
            </div>
          )}
          <p className="text-black text-sm font-medium">{item.grapheme_name}</p>
          <p className="hidden md:inline-block text-gray-500 text-sm font-normal">
            {item.grapheme_description}
          </p>
        </div>

        <div className="md:col-span-4 flex space-between space-x-3">
          <div className="flex items-center space-x-2 flex-1 pr-6 md:pr-12">
            {item.highest_risk && (
              <div className="flex-shrink-0 flex items-center">
                <CheckIcon code={item.highest_risk.status} />
              </div>
            )}

            <p className="md:font-medium text-gray-500 md:text-black text-sm w-full md:pl-2">
              {item.rating === "pass" ? item.title : item.highest_risk?.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
