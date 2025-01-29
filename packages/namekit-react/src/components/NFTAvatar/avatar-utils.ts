export enum AvatarType {
  "NFT" = "nft",
  "ACCOUNT" = "account",
}

export enum AvatarSize {
  "MINI" = "w-8 h-8",
  "SMALL" = "w-12 h-12",
  "MEDIUM" = "w-24 h-24 md:w-44 md:h-44",
  "BIG" = "w-64 min-h-64 lg:w-full max-w-[468px]",
  "HUGE" = "h-[335px] w-[335px]",
}

export enum AvatarRoundedCorners {
  "md" = "rounded-md",
  "xl" = "rounded-big md:rounded-biggest",
}

export const DEFAULT_AVATAR_SHADOW = "rgb(63, 135, 202)";

export const getRoundedCornerDimension = (
  type: AvatarType,
  size: AvatarSize,
) => {
  if (type === AvatarType.NFT) {
    return size === AvatarSize.BIG || size === AvatarSize.HUGE
      ? AvatarRoundedCorners.xl
      : AvatarRoundedCorners.md;
  } else if (type === AvatarType.ACCOUNT) {
    return AvatarRoundedCorners.md;
  }
};

export enum NftAvatarLoadingMethod {
  /*
    For SHOW_LOADING_UNTIL_ALL_CONFIRMED loading
    method we wait for the font-size, shadow color
    and image to be calculated before we show
    NftAvatar loaded state. In the meantime
    we display a gray LoadingNftAvatar.
  */
  SHOW_LOADING_UNTIL_ALL_CONFIRMED = "SHOW_LOADING_UNTIL_ALL_CONFIRMED",

  /*
    For SHOW_INSTANT_ASSUMPTION_NO_CUSTOM_AVATAR loading method we
    instantly display blue avatar background on loading state,
    if the name is normalized. If it is not normalized,
    we instantly display a red avatar background.
  */
  SHOW_INSTANT_ASSUMPTION_NO_CUSTOM_AVATAR = "SHOW_INSTANT_ASSUMPTION_NO_CUSTOM_AVATAR",

  /*
    For both loading methods we display a
    blue NormalizedNameNftAvatar (when name
    is normalized) when ENS name has no avatar
    image set in its text records. For unnormalized
    names we display a red NotNormalizedNameNftAvatar.
  */
}

export const nftAvatarTestCases: Array<Record<string, string>> = [
  {
    testCase:
      "i-have-a-dream-that-my-four-little-children-will-one-day-live-in-a-nation-where-they-will-not-be-judged-by-the-color-of-their-skin-but-by-the-content-of-their-character.eth",
    testCaseLabel: "Long name",
  },
  {
    testCase:
      "[c997e536d33ac57b9a9e7401a40bd6d45433c28a4b8fe53352b3d12d570f577c].eth",
    testCaseLabel: "Unknown name",
  },
  {
    testCase:
      "[299824e20b9f44dc83e3581a6b45ba74778e1522c422ba4ddf9f3eb461261a2b].eth",
    testCaseLabel: "Invalid name",
  },
  {
    testCase: "ҵҵҵ.eth",
    testCaseLabel: "Glyph name",
  },
  {
    testCase: "vitalik.eth",
    testCaseLabel: "Disambiguation rule",
  },
  {
    testCase: "1⃣2⃣.eth",
    testCaseLabel: "Beautified name",
  },
  {
    testCase: "🧌🧌🧌.eth",
    testCaseLabel: "Emoji v14",
  },
  {
    testCase: "🫠🫠🫠.eth",
    testCaseLabel: "Emoji v15",
  },
  {
    testCase: "🐦‍⬛.eth",
    testCaseLabel: "Multi-codepoint emoji",
  },
  {
    testCase:
      "👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦👨‍👩‍👦aa👨‍👩‍👦.eth",
    testCaseLabel: "Avoiding Grapheme Splitting",
  },
  {
    testCase: "tri.eth",
    testCaseLabel: "3-letters name",
  },
  {
    testCase: "salad.eth",
    testCaseLabel: "5-letters name",
  },
  {
    testCase: "﷽﷽﷽.eth",
    testCaseLabel: "Arabic characters",
  },
  {
    testCase: "thisisaverylongnamebutnotsolong.eth",
    testCaseLabel: "34-letters name",
  },
  {
    testCase: "thisisaveryveryverylongnamebutnotsolong.eth",
    testCaseLabel: "42-letters name",
  },
  {
    testCase: "thisisaveryveryveryveryverylongnamebutnotsolong.eth",
    testCaseLabel: "50-letters name",
  },
  {
    testCase: "thisisaveryveryveryveryveryveryverylongnamebutnotsolong.eth",
    testCaseLabel: "58-letters name",
  },
];

export const accountAvatarTestCases: Array<Record<string, string>> = [
  {
    testCase: "0x1c8077047950a5a99c746bdeeb2516ffe6c16ac1",
    testCaseLabel: "No primary name",
  },
  {
    testCase: "0x93ba7270e99ebd28119b44a537229b8283c6bf85",
    testCaseLabel: "No custom avatar",
  },
  {
    testCase: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    testCaseLabel: "Custom account avatar",
  },
];
