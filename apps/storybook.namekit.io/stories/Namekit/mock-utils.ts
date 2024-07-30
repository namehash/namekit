import { ENSName, buildENSName } from "@namehash/ens-utils";

export enum DisplayedNameVariant {
  SHORT_NAME = "SHORT_NAME",
  LONG_NAME = "LONG_NAME",
  WITHOUT_TOOLTIP = "WITHOUT_TOOLTIP",
  SHORT_MAX_WIDTH = "SHORT_MAX_WIDTH",
  DISPLAY_UNNORMALIZED_NAMES = "DISPLAY_UNNORMALIZED_NAMES",
}

export enum TruncatedTextExample {
  SHORT_TEXT = "SHORT_TEXT",
  LONG_TEXT = "LONG_TEXT",
}

export const getExampleTruncatedText = (
  example: TruncatedTextExample,
): string => {
  switch (example) {
    case TruncatedTextExample.SHORT_TEXT:
      return "heyiamsmall";
    case TruncatedTextExample.LONG_TEXT:
      return "heyiamaverylongtextthatkeepsgrowingunstopablyomgiamstillgoingonokdone";
  }
};

export const getENSNameForVariant = (
  example: DisplayedNameVariant,
): ENSName => {
  switch (example) {
    case DisplayedNameVariant.SHORT_NAME:
      return buildENSName("lightwalker.eth");
    case DisplayedNameVariant.LONG_NAME:
    case DisplayedNameVariant.WITHOUT_TOOLTIP:
      return buildENSName("thisìsaveryveryveryveryveryverylongname.eth");
    case DisplayedNameVariant.DISPLAY_UNNORMALIZED_NAMES:
      return buildENSName("‍420.eth");
    case DisplayedNameVariant.SHORT_MAX_WIDTH:
      return buildENSName("thisìsaveryveryveryveryveryverylongname.eth");
  }
};
