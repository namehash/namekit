import React from "react";
import { ConsolidatedGraphemeGuardReport } from "@namehash/nameguard";

import { CheckIcon } from "./CheckIcon";
import { RiskCounter } from "./RiskCounter";
import { useGraphemeModalStore } from "../../stores/grapheme";

type GraphemeListItemProps = {
  item: ConsolidatedGraphemeGuardReport;
};

export function GraphemeListItem({ item }: GraphemeListItemProps) {
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
        <p className="text-4xl text-black font-bold ens-webfont">
          {item.grapheme}
        </p>
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
            <div className="flex-grow md:order-2 flex items-center">
              <p className="md:font-medium text-gray-500 md:text-black text-sm w-full md:pl-2">
                {item.rating === "pass"
                  ? item.title
                  : item.highest_risk?.message}
              </p>
            </div>

            <div className="flex-shrink-0 md:order-3 flex items-center md:ml-auto">
              <RiskCounter count={item.risk_count} />
            </div>

            <div className="flex-shrink-0 ml-auto md:ml-auto md:order-1 flex items-center">
              <CheckIcon code={item.highest_risk.status} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
