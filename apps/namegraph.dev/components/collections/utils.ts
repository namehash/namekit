export const PREFERRED_TLD_LOCALSTORAGE_KEY = "PREFERRED_TLD";

export const Tlds = {
  ETH: "ETH",
  BOX: "BOX",
  CB: "CB",
} as const;
export type Tlds = (typeof Tlds)[keyof typeof Tlds];

export const availableTlds: Record<Tlds, string> = {
  [Tlds.ETH]: ".eth",
  [Tlds.BOX]: ".box",
  [Tlds.CB]: ".base.eth",
};

export const DEFAULT_PAGE_NUMBER = 1;
