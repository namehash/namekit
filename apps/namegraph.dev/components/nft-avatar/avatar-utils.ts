export enum AvatarSize {
  "MINI" = "w-8 h-8",
  "SMALL" = "w-12 h-12",
  "MEDIUM" = "w-24 h-24 md:w-44 md:h-44",
  "BIG" = "w-64 min-h-64 lg:w-full max-w-[468px]",
  "HUGE" = "h-[335px] w-[335px]",
}

export const DEFAULT_AVATAR_SHADOW = "rgb(63, 135, 202)";

export const getAvatarBorderRadius = (size: AvatarSize) => {
  switch (size) {
    case AvatarSize.HUGE:
    case AvatarSize.BIG:
    case AvatarSize.MEDIUM:
      return "rounded-[36px]";
    case AvatarSize.SMALL:
      return "rounded-[9px]";
    case AvatarSize.MINI:
      return "rounded-[6px]";
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
