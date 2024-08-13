import React from "react";
import type { NameGuardReport } from "@namehash/nameguard";

import { LabelListItem } from "./LabelListItem";

type LabelListProps = {
  items?: NameGuardReport["labels"];
};

export function LabelList({ items = [] }: LabelListProps) {
  const rawLabels = items?.map((i) => i.label) ?? [];

  return items?.map((label, index) => (
    <LabelListItem
      key={index}
      index={index}
      item={label}
      rawLabels={rawLabels}
    />
  ));
}
