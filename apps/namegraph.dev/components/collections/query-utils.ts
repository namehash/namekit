import { NameGraphSortOrderOptions } from "@namehash/namegraph-sdk/utils";
import { availableSuffixes, Suffixes } from "../suffix-select";

export const DEFAULT_PAGE_NUMBER = 1;
export const DEFAULT_COLLECTIONS_PARAMS: Record<string, any> = {
  search: "",
  page: DEFAULT_PAGE_NUMBER,
  orderBy: NameGraphSortOrderOptions.AI,
  exactMatch: false,
  tld: availableSuffixes[Suffixes.ETH],
};
