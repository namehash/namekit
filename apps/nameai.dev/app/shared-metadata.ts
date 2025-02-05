import type { Metadata } from "next";

export const siteName = "NameAI";
export const defaultMetaTitle = "NameAI - Enable new ENS user experiences";
export const defaultMetaDescription =
  "Discover the words that otherwise hidden in labels.";
export const defaultMetaKeywords = [
  "ens",
  "web3",
  "eth",
  "nameguard",
  "namegraph",
  "namekit",
  "nameai",
];

export const baseUrl = "https://nameai.dev";

export const defaultMetaOpengraph: Metadata["openGraph"] = {
  title: {
    template: `%s`,
    default: defaultMetaTitle,
  },
  type: "website",
  siteName,
};

export const defaultMetaTwitter: Metadata["twitter"] = {
  title: {
    template: `${siteName} - %s`,
    default: defaultMetaTitle,
  },
  card: "summary_large_image",
  site: "@NamehashLabs",
  creator: "@NamehashLabs",
};
