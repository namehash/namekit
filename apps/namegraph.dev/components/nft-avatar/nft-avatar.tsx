/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import cc from "classcat";
import {
  AvatarSize,
  DEFAULT_AVATAR_SHADOW,
  NftAvatarLoadingMethod,
} from "./avatar-utils";
import React, { useEffect, useRef, useState } from "react";
import { useScreenSize } from "./use-screen-size";
import { NotNormalizedNameNftAvatar } from "./not-normalized-name";
import { NormalizedNameNftAvatar } from "./normalized-name";
import { LoadingNftAvatar } from "./loading-nft-avatar";
import { EnsOutlineIcon } from "./ens-outline-icon";
import { DisplayedName, DisplayedNameConfig } from "./displayed-name";
import { ENSName, Normalization } from "@namehash/ens-utils";
import { FastAverageColor } from "fast-average-color";
import { isSafari } from "react-device-detect";
import Image from "next/image";
// @ts-ignore
import Atropos from "atropos/react";

/*
  Launch Readiness Removal: NFT Details Page is not ready!

    import Link from "next/link";
*/

interface AvatarProps {
  onAverageColorDiscovery?: (averageColor: string) => void;
  loadingMethod?: NftAvatarLoadingMethod;
  name: ENSName | null; // when null show loading skeleton
  ensStampsConfig?: ENSStampsConfig;
  nameDoesntExist?: boolean;
  withLink: boolean;
  size: AvatarSize;

  /* Only for AvatarSize.BIG and AvatarSize.HUGE */
  is3d?: boolean;
}

export enum ENSStampsConfig {
  NFTDetailsPage,
}

const MIN_AVATAR_FONT_SIZE_FOR_SMALL_AVATARS = 21;
const MIN_AVATAR_FONT_SIZE_FOR_MEDIUM_AVATARS = 24;
const MIN_AVATAR_FONT_SIZE_FOR_BIG_AVATARS = 27;

export const NftAvatar = ({
  size,
  name,
  is3d,
  withLink,
  nameDoesntExist,
  ensStampsConfig,
  onAverageColorDiscovery,
  loadingMethod = NftAvatarLoadingMethod.SHOW_INSTANT_ASSUMPTION_NO_CUSTOM_AVATAR,
}: AvatarProps) => {
  const imageRef = useRef(null);
  const fac = new FastAverageColor();
  const { isDesktop, isTablet } = useScreenSize();
  const [loadedImage, setLoadedImage] = useState(false);
  const avatarDomainNameRef = useRef<HTMLDivElement>(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [shadowColor, setShadowColor] = useState<string>(DEFAULT_AVATAR_SHADOW);
  const [withInteractiveAnimation] = useState<boolean>(
    size === AvatarSize.BIG || size === AvatarSize.HUGE,
  );
  const [withText] = useState<boolean>(
    size === AvatarSize.BIG || size === AvatarSize.HUGE,
  );
  const avatarBorderRadius = "rounded-[36px]";
  const [nameFontSizeIsCalculated, setNameFontSizeIsCalculated] =
    useState(false);
  const [stopDisplayingLoadingState, setStopDisplayingLoadingState] =
    useState(false);

  const [srcUrl, setSrcUrl] = useState<string>(
    !!name ? `https://metadata.ens.domains/mainnet/avatar/${name.name}` : `/`,
  );

  const handleLoading = () => {
    if (withInteractiveAnimation) setShadowColor(DEFAULT_AVATAR_SHADOW);
  };

  const handleLoaded = () => {
    setCustomShadowColor();
    setImageLoadError(false);
    setLoadedImage(true);

    if (
      loadingMethod ===
        NftAvatarLoadingMethod.SHOW_INSTANT_ASSUMPTION_NO_CUSTOM_AVATAR &&
      name
    ) {
      setStopDisplayingLoadingState(true);
    }
  };

  const handleError = () => {
    setImageLoadError(true);
    setShadowColor(DEFAULT_AVATAR_SHADOW);
    onAverageColorDiscovery?.(DEFAULT_AVATAR_SHADOW);

    if (
      loadingMethod ===
        NftAvatarLoadingMethod.SHOW_INSTANT_ASSUMPTION_NO_CUSTOM_AVATAR &&
      name
    ) {
      setStopDisplayingLoadingState(true);
    }
  };

  const setCustomShadowColor = async () => {
    if (imageRef.current) {
      const wrapperElm: HTMLImageElement = imageRef.current;
      const imageElm = wrapperElm.children[0];

      console.log("wrapperElm", wrapperElm);
      console.log("imageElm", imageElm);

      let averageAvatarColor;
      if (imageElm) {
        averageAvatarColor = await fac.getColorAsync(
          imageElm as HTMLImageElement,
        );
      }

      if (averageAvatarColor) {
        setShadowColor(averageAvatarColor.rgb);
        onAverageColorDiscovery?.(averageAvatarColor.rgb);
      } else {
        setShadowColor(DEFAULT_AVATAR_SHADOW);
        onAverageColorDiscovery?.(DEFAULT_AVATAR_SHADOW);
      }
    }
  };

  useEffect(() => {
    if (!!name && !loadedImage && !imageLoadError) {
      setSrcUrl(`https://metadata.ens.domains/mainnet/avatar/${name.name}`);
      handleLoading();
    }

    if (name && name.normalization !== Normalization.Normalized) {
      setStopDisplayingLoadingState(true);
    }
  }, [name]);

  // For NftAvatarLoadingMethod.SHOW_LOADING_UNTIL_ALL_CONFIRMED loading method
  const onNewLoadingState = () => {
    if (
      name &&
      shadowColor &&
      nameFontSizeIsCalculated &&
      (loadedImage || imageLoadError)
    ) {
      setStopDisplayingLoadingState(true);
    }
  };

  useEffect(() => {
    onNewLoadingState();
  }, [shadowColor, loadedImage, imageLoadError, nameFontSizeIsCalculated]);

  const AvatarLayout =
    (name && name.name && name.normalization !== Normalization.Normalized) ||
    // &&  !domainCard?.name.normalizedName
    (nameDoesntExist && name) ? (
      <NotNormalizedNameNftAvatar
        size={size}
        nameDoesntExist={nameDoesntExist}
        // normalization={domainCard?.nameGuardResult.normalization}
      />
    ) : (
      <div
        className={cc([
          size,
          avatarBorderRadius,
          "animated-fadeIn overflow-hidden transition-all duration-500 relative",
        ])}
        data-atropos-offset="2"
        style={{
          // we want to show shadows only after all the important details are loaded
          backgroundColor:
            withInteractiveAnimation && stopDisplayingLoadingState && name
              ? shadowColor
              : "transparent",
          boxShadow:
            withInteractiveAnimation && stopDisplayingLoadingState && name
              ? `0px 0px 30px 3px ${shadowColor}`
              : "none",
        }}
      >
        <div
          className={cc([
            avatarBorderRadius,
            "aspect-square overflow-hidden flex-shri0 z-20 relative",
          ])}
        >
          <div
            className={cc([
              {
                "animate-fadeOut":
                  stopDisplayingLoadingState && !imageLoadError && name,
              },
            ])}
          >
            {loadingMethod ===
              NftAvatarLoadingMethod.SHOW_INSTANT_ASSUMPTION_NO_CUSTOM_AVATAR ||
            (imageLoadError && name) ? (
              <NormalizedNameNftAvatar
                data-atropos-offset="2"
                className={cc([
                  avatarBorderRadius,
                  {
                    "animate-pulse":
                      !stopDisplayingLoadingState && !imageLoadError,
                  },
                ])}
              />
            ) : loadingMethod ===
              NftAvatarLoadingMethod.SHOW_LOADING_UNTIL_ALL_CONFIRMED ? (
              <LoadingNftAvatar
                className={cc([
                  "w-full h-full",
                  avatarBorderRadius,
                  {
                    "animate-pulse": name,
                  },
                ])}
              />
            ) : null}
          </div>
          {!isSafari && stopDisplayingLoadingState && (
            <div
              className={cc([
                avatarBorderRadius,
                "bg-black/5 shadow-xl shadow-white z-10 absolute left-0 top-0 w-full h-full",
              ])}
            ></div>
          )}
          <div
            className={cc([
              "absolute left-0 top-0 w-full",
              {
                "animate-fadeIn z-20": stopDisplayingLoadingState,
              },
            ])}
          >
            <div
              className={cc([
                avatarBorderRadius,
                {
                  "animate-pulse":
                    !stopDisplayingLoadingState && !imageLoadError,
                },
                "ens-webfont absolute top-0 left-0 h-full w-full font-semibold text-white z-20 transform-gpu",
              ])}
            >
              <div
                className={cc([
                  "absolute top-[12%] left-[11%] z-20 drop-shadow-2xl",
                  {
                    "lg:left-[11%]":
                      ensStampsConfig === ENSStampsConfig.NFTDetailsPage,
                  },
                ])}
              >
                <EnsOutlineIcon
                  fill="#FFF"
                  data-atropos-offset="3"
                  className={cc([
                    "w-[20%] aspect-square",
                    {
                      "lg:w-[26.5%]":
                        ensStampsConfig === ENSStampsConfig.NFTDetailsPage,
                    },
                  ])}
                />
              </div>
              {withText && name && (
                <div
                  className={cc([
                    "w-full text-left absolute bottom-1.5 drop-shadow-2xl lg:bottom-[3%] py-6 px-7 left-0 md:pl-[12%] md:pr-[13%] lg:px-[11.5%] max-w-full break-all",
                    {
                      "lg:!bottom-[6%]":
                        ensStampsConfig === ENSStampsConfig.NFTDetailsPage,
                    },
                  ])}
                >
                  <div
                    className={cc([
                      "w-full",
                      {
                        invisible: !stopDisplayingLoadingState,
                      },
                    ])}
                    ref={avatarDomainNameRef}
                    data-atropos-offset="3"
                  >
                    <DisplayedName
                      domainName={name}
                      fontConfigClasses={DisplayedNameConfig.NFTAvatar}
                      parentReferenceForFontResizing={avatarDomainNameRef}
                      minFontSize={
                        size === AvatarSize.BIG || size === AvatarSize.HUGE
                          ? isDesktop
                            ? MIN_AVATAR_FONT_SIZE_FOR_BIG_AVATARS
                            : isTablet
                              ? MIN_AVATAR_FONT_SIZE_FOR_MEDIUM_AVATARS
                              : MIN_AVATAR_FONT_SIZE_FOR_SMALL_AVATARS
                          : MIN_AVATAR_FONT_SIZE_FOR_SMALL_AVATARS
                      }
                      onFinishedNameCalculations={(e: boolean) =>
                        setNameFontSizeIsCalculated(e)
                      }
                    />
                  </div>
                </div>
              )}
            </div>
            <div
              className={cc([
                size,
                "relative aspect-square",
                {
                  "opacity-0": !stopDisplayingLoadingState || imageLoadError,
                },
              ])}
              ref={imageRef}
            >
              {name && (
                <Image
                  unoptimized
                  src={srcUrl}
                  layout="fill"
                  onError={handleError}
                  onLoad={handleLoading}
                  data-atropos-offset="2"
                  crossOrigin="anonymous"
                  className={avatarBorderRadius}
                  onLoadingComplete={handleLoaded}
                  alt={`${name && name.displayName} NFT Avatar`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );

  if (
    (withInteractiveAnimation && stopDisplayingLoadingState && !isSafari) ||
    (!name && stopDisplayingLoadingState)
  ) {
    if (is3d) {
      const AnimatedAvatar = <Atropos className={size}>{AvatarLayout}</Atropos>;

      return (
        <>
          {withLink && name
            ? /*
             Launch Readiness Removal: NFT Details Page is not ready!

               <Link
                 href={`/name/${name.slug}`}
                 className="w-full flex justify-center mt-auto"
               >
                 {AnimatedAvatar}
               </Link>
           */
              AnimatedAvatar
            : AnimatedAvatar}
        </>
      );
    }
  }

  return withLink && name
    ? /*
        Launch Readiness Removal: NFT Details Page is not ready!

          <Link
            className="w-full flex justify-center mt-auto"
            href={`/name/${name.slug}`}
          >
            {AvatarLayout}
          </Link>
      */
      AvatarLayout
    : AvatarLayout;
};
