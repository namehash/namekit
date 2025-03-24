import type { Metadata } from "next";

export const siteName = "NameHash Labs";
export const defaultMetaTitle = "NameHash Labs - Helping ENS Grow";
export const defaultMetaDescription =
  "NameHash Labs builds open source infrastructure to support the global adoption of ENS.";
export const defaultMetaKeywords = [
  "ens",
  "namehash",
];

export const baseUrl = "https://namehashlabs.org";

export const defaultMetaOpengraph: Metadata["openGraph"] = {
  title: {
    template: `${siteName} - %s`,
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
