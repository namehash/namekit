import { NotNormalizedNameEnsAvatar } from "./NotNormalizedNameEnsAvatar";
import { useEffect, useRef, useState } from "react";
import cc from "classcat";
import React from "react";
import { ENSName } from "@namehash/ens-utils";
import { Normalization } from "@namehash/nameguard";
import { EnsOutlineIcon } from "./EnsOutlineIcon";
import { NormalizedNameEnsAvatar } from "./NormalizedNameEnsAvatar";
import { LoadingEnsAvatar } from "./LoadingEnsAvatar";

interface AvatarProps {
  name: ENSName | null; // when null show loading skeleton
}

const getEnsAvatarEndpoint = (name: string) => {
  return `https://metadata.ens.domains/mainnet/avatar/${encodeURIComponent(name)}`;
};

export const EnsAvatar = ({ name }: AvatarProps) => {
  const imageRef = useRef(null);

  const [hasLoadedImage, setHasLoadedImage] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const [stopDisplayingLoadingState, setStopDisplayingLoadingState] =
    useState(false);

  const [srcUrl, setSrcUrl] = useState<string>(
    !!name ? getEnsAvatarEndpoint(name.name) : `/`,
  );

  const handleLoaded = () => {
    setImageLoadError(false);
    setHasLoadedImage(true);
  };

  const handleError = () => {
    setImageLoadError(true);
  };

  useEffect(() => {
    if (!!name && !hasLoadedImage && !imageLoadError) {
      setSrcUrl(getEnsAvatarEndpoint(name.name));
    }

    if (name && name.normalization !== Normalization.normalized) {
      setStopDisplayingLoadingState(true);
    }
  }, [name]);

  const onNewLoadingState = () => {
    if (name && (hasLoadedImage || imageLoadError)) {
      setStopDisplayingLoadingState(true);
    }
  };

  useEffect(() => {
    onNewLoadingState();
  }, [hasLoadedImage, imageLoadError]);

  const EnsAvatarLayout =
    name && name.normalization !== Normalization.normalized ? (
      <NotNormalizedNameEnsAvatar
        normalization={name.normalization as Normalization}
      />
    ) : (
      <div
        className="nk-rounded-md nk-w-12 nk-h-12 nk-animated-fadeIn nk-overflow-hidden nk-transition-all nk-duration-500 nk-relative"
        data-atropos-offset="2"
      >
        <div className="nk-rounded-md nk-aspect-square nk-overflow-hidden nk-flex-shrink-0 nk-z-20 nk-relative">
          <div
            className={cc([
              {
                "nk-animate-fadeOut":
                  stopDisplayingLoadingState && !imageLoadError && name,
              },
            ])}
          >
            {imageLoadError && name ? (
              <NormalizedNameEnsAvatar
                data-atropos-offset="2"
                className={cc([
                  "nk-rounded-md",
                  {
                    "nk-animate-pulse":
                      !stopDisplayingLoadingState && !imageLoadError,
                  },
                ])}
              />
            ) : (
              <LoadingEnsAvatar
                className={cc([
                  "nk-w-full nk-h-full vrounded-md",
                  {
                    "nk-animate-pulse": name,
                  },
                ])}
              />
            )}
          </div>
          {stopDisplayingLoadingState && (
            <div
              className={cc([
                "nk-rounded-md nk-bg-black/5 nk-shadow-xl nk-shadow-white nk-z-10 nk-absolute nk-left-0 nk-top-0 nk-w-full nk-h-full",
              ])}
            ></div>
          )}
          <div
            className={cc([
              "nk-absolute nk-left-0 nk-top-0 nk-w-full",
              {
                "nk-animate-fadeIn nk-z-20": stopDisplayingLoadingState,
              },
            ])}
          >
            <div
              className={cc([
                {
                  "nk-animate-pulse":
                    !stopDisplayingLoadingState && !imageLoadError,
                },
                "nk-rounded-md nk-ens-webfont nk-absolute nk-top-0 nk-left-0 nk-h-full nk-w-full nk-font-semibold nk-text-white nk-z-20 nk-transform-gpu",
              ])}
            >
              <div className="nk-absolute nk-top-[12%] nk-left-[11%] nk-z-20 nk-drop-shadow-2xl">
                <EnsOutlineIcon
                  fill="#FFF"
                  data-atropos-offset="3"
                  className="nk-w-[20%] nk-aspect-square"
                />
              </div>
            </div>
            <div
              className={cc([
                "nk-w-12 nk-h-12 nk-relative nk-aspect-square",
                {
                  "nk-opacity-0": !stopDisplayingLoadingState || imageLoadError,
                },
              ])}
              ref={imageRef}
            >
              {name && (
                <img
                  src={srcUrl}
                  onError={handleError}
                  data-atropos-offset="2"
                  crossOrigin="anonymous"
                  className="nk-rounded-md"
                  onLoad={handleLoaded}
                  alt={`${name && name.displayName} NFT Avatar`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );

  return EnsAvatarLayout;
};
