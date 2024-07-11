import React from "react";
import {
  CheckResultCode,
  ConsolidatedGraphemeGuardReport,
} from "@namehash/nameguard";

import { CheckResultCodeIcon } from "./CheckResultCodeIcon";
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
      className="ng-grid ng-grid-cols-8 md:ng-grid-cols-12 ng-gap-4 ng-py-5 ng-pl-6 ng-cursor-pointer ng-transition-colors hover:ng-bg-gray-50 last:ng-rounded-b-md"
      onClick={handleClick}
    >
      <div className="ng-flex md:ng-items-center ng-justify-center">
        <p className="ng-text-4xl ng-text-black ng-font-bold ng-ens-webfont">
          {item.grapheme}
        </p>
      </div>
      <div className="md:ng-grid md:ng-grid-cols-7 md:ng-gap-4 ng-col-span-7 md:ng-col-span-11">
        <div className="md:ng-col-span-3">
          <p className="ng-text-black ng-text-sm ng-font-medium">
            {item.grapheme_name}
          </p>
          <p className="ng-hidden md:ng-inline-block ng-text-gray-500 ng-text-sm ng-font-normal">
            {item.grapheme_description}
          </p>
        </div>

        <div className="md:ng-col-span-4 ng-flex ng-space-between ng-space-x-3">
          <div className="ng-flex ng-items-center md:ng-space-between ng-justify-between md:ng-justify-start ng-space-y-1 md:ng-space-y-0 md:ng-space-x-2 ng-flex-1 ng-pr-6 md:ng-pr-12 ng-flex-wrap">
            <div className="ng-flex-grow md:ng-order-2 ng-flex ng-items-center">
              <p className="md:ng-font-medium ng-text-gray-500 md:ng-text-black ng-text-sm ng-w-full md:ng-pl-2">
                {item.rating === "pass"
                  ? item.title
                  : item.highest_risk?.message}
              </p>
            </div>

            <div className="ng-flex-shrink-0 md:ng-order-3 ng-flex ng-items-center md:ng-ml-auto">
              <RiskCounter count={item.risk_count} />
            </div>

            {item.highest_risk ? (
              <div className="ng-flex-shrink-0 ng-ml-auto md:ng-ml-auto md:ng-order-1 ng-flex ng-items-center">
                <CheckResultCodeIcon
                  isInteractive={true}
                  className="ng-cursor-pointer"
                  code={item.highest_risk.status}
                />
              </div>
            ) : (
              <div className="ng-flex-shrink-0 ng-ml-auto md:ng-ml-auto md:ng-order-1 ng-flex ng-items-center">
                <CheckResultCodeIcon
                  isInteractive={true}
                  className="ng-cursor-pointer"
                  code={CheckResultCode.pass}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
