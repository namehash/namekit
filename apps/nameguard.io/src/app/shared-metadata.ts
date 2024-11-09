import type { Metadata } from "next";

export const siteName = "NameGuard";
export const defaultMetaTitle =
  "NameGuard - Protect your community with NameGuard for ENS";
export const defaultMetaDescription =
  "Guard your users from heartbreak and encourage best practice usage of ENS.";
export const defaultMetaKeywords = [
  "ens",
  "web3",
  "eth",
  "nameguard",
  "namegraph",
  "namekit",
];

export const baseUrl = "https://nameguard.io";

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
