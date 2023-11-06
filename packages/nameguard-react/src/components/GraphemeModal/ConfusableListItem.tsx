import React from "react";
import { GraphemeGuardReport } from "@namehash/nameguard";

import { Check } from "../Report/Check";

type ConfusableListItemProps = {
  item: GraphemeGuardReport["confusables"][0];
};

export const ConfusableListItem = ({ item }: ConfusableListItemProps) => {
  return (
    <div className="grid grid-cols-8 md:grid-cols-12 gap-4 py-5 pl-6">
      <div className="flex md:items-center justify-center">
        <p className="text-4xl text-black font-bold">{item.grapheme}</p>
      </div>
      <div className="md:grid md:grid-cols-7 md:gap-4 col-span-7 md:col-span-11">
        <div className="md:col-span-3">
          <p className="text-black text-sm font-medium">{item.grapheme_name}</p>
          <p className="hidden md:inline-block text-gray-500 text-sm font-normal">
            {item.grapheme_description}
          </p>
        </div>

        <div className="md:col-span-4 flex space-between space-x-3">
          <div className="flex items-center md:space-between justify-between md:justify-start space-y-1 md:space-y-0 md:space-x-2 flex-1 pr-6 md:pr-12 flex-wrap">
            <div className="flex-grow flex items-center">
              <p className="md:font-medium text-gray-500 md:text-black text-sm w-full md:pl-2">
                {item.rating === "pass"
                  ? item.title
                  : item.highest_risk?.message}
              </p>
            </div>

            <div className="flex-shrink-0 ml-auto md:ml-auto md:order-1 flex items-center">
              <Check code={item.rating} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
