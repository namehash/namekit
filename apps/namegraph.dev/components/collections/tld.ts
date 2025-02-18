export const PREFERRED_TLD_LOCALSTORAGE_KEY = "PREFERRED_TLD";

export const Tlds = {
  ETH: "ETH",
  BOX: "BOX",
  CB: "CB",
  LINEA: "LINEA",
  UNICORN: "UNICORN",
  POAP: "POAP",
  UNI: "UNI",
  FCAST: "FCAST",
} as const;
export type Tlds = (typeof Tlds)[keyof typeof Tlds];

export const availableTlds: Record<Tlds, string> = {
  [Tlds.ETH]: ".eth",
  [Tlds.BOX]: ".box",
  [Tlds.CB]: ".base.eth",
  [Tlds.LINEA]: ".linea.eth",
  [Tlds.UNICORN]: ".unicorn.eth",
  [Tlds.POAP]: ".poap.xyz",
  [Tlds.UNI]: ".uni.eth",
  [Tlds.FCAST]: ".fcast.id",
};
