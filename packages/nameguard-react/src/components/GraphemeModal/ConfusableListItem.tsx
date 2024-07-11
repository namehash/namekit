import React from "react";
import { CheckResultCode, GraphemeGuardReport } from "@namehash/nameguard";

import { CheckResultCodeIcon } from "../Report/CheckResultCodeIcon";
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
      className="ng-grid ng-grid-cols-8 md:ng-grid-cols-12 ng-gap-4 ng-py-5 ng-pl-6 ng-cursor-pointer ng-transition-colors hover:ng-bg-gray-50 last:ng-rounded-b-md"
      onClick={handleClick}
    >
      <div className="ng-flex md:ng-items-center ng-justify-center">
        <p className="ng-text-4xl ng-text-black ng-font-bold">
          {item.grapheme}
        </p>
      </div>
      <div className="md:ng-grid md:ng-grid-cols-7 md:ng-gap-4 ng-col-span-7 md:ng-col-span-11">
        <div className="md:ng-col-span-3">
          {item.is_canonical && (
            <div className="ng-mb-1.5 ng--mt-4 ng-relative ng-text-green-800 ng-text-xs ng-font-medium ng-rounded-full ng-px-2 ng-py-0.5 ng-bg-green-100 ng-inline-block">
              Canonical
            </div>
          )}
          <p className="ng-text-black ng-text-sm ng-font-medium">
            {item.grapheme_name}
          </p>
          <p className="ng-hidden md:ng-inline-block ng-text-gray-500 ng-text-sm ng-font-normal">
            {item.grapheme_description}
          </p>
        </div>

        <div className="md:ng-col-span-4 ng-flex ng-space-between ng-space-x-3">
          <div className="ng-flex ng-items-center ng-space-x-2 ng-flex-1 ng-pr-6 md:ng-pr-12">
            {item.highest_risk ? (
              <div className="ng-flex-shrink-0 ng-flex ng-items-center">
                <CheckResultCodeIcon
                  isInteractive={true}
                  code={item.highest_risk.status}
                />
              </div>
            ) : (
              <div className="ng-flex-shrink-0 ng-flex ng-items-center">
                <CheckResultCodeIcon
                  isInteractive={true}
                  code={CheckResultCode.pass}
                />
              </div>
            )}

            <p className="md:ng-font-medium ng-text-gray-500 md:ng-text-black ng-text-sm ng-w-full md:ng-pl-2">
              {item.rating === "pass" ? item.title : item.highest_risk?.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
