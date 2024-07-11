import React from "react";
import { GraphemeGuardReport } from "@namehash/nameguard";

import { ConfusableListItem } from "./ConfusableListItem";

type ConfusableListProps = {
  items: GraphemeGuardReport["confusables"];
};

export const ConfusableList = ({ items }: ConfusableListProps) => {
  if (!items || items?.length === 0) return null;

  return (
    <div className="ng-rounded-md ng-border ng-border-gray-200 ng-divide-y ng-divide-gray-200">
      {items?.map((confusable, index) => (
        <ConfusableListItem key={index} item={confusable} />
      ))}
    </div>
  );
};
