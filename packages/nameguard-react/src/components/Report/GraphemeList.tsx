import React from "react";

import { GraphemeListItem } from "./GraphemeListItem";
import { NameGuardReport } from "@namehash/nameguard";

type GraphemeListProps = {
  items?: NameGuardReport["labels"][0]["graphemes"];
};

export const GraphemeList = ({ items }: GraphemeListProps) => {
  return items?.map((grapheme, index) => (
    <GraphemeListItem key={index} item={grapheme} />
  ));
};
