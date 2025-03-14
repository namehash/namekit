"use client";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { FastAverageColor } from "fast-average-color";
import { EnsSolidIcon, TwitterIcon } from "../1 - atoms/";
import { Profile } from "@/data/ensProfiles";
import { useId } from "react";
import cc from "classcat";
import { Tooltip } from "@namehash/namekit-react/client";
import { EfpLogo } from "../1 - atoms/icons/efp-logo";
import { ProfileStats } from "ethereum-identity-kit";

interface AvatarWithTooltipProps {
  className?: string;
  profile: Profile;
  size?: AvatarSize;
  avatarQueryResponse: Response | null;
}

export enum AvatarSize {
  SMALL = 80,
  MEDIUM = 120,
}

const AvatarSizeStyling = {
  [AvatarSize.SMALL]: "min-w-[80px] w-20 h-20",
  [AvatarSize.MEDIUM]: "w-20 h-20 lg:w-[120px] lg:h-[120px]",
};

const DEFAULT_AVATAR_SHADOW = "rgba(0, 0, 0, 0.4)";

export const AvatarWithTooltip = ({
  size = AvatarSize.MEDIUM,
  className = "",
  profile,
  avatarQueryResponse,
}: AvatarWithTooltipProps) => {
  const [shadowColor, setShadowColor] = useState(DEFAULT_AVATAR_SHADOW);
  const [successfullyLoadedAvatar, setSuccessfullyLoadedAvatar] =
    useState(false);
  const fac = new FastAverageColor();

  const avatarID = "image-" + useId();

  useEffect(() => {
    if (avatarQueryResponse !== null) {
      updateAvatarImageSrcAttribute(avatarQueryResponse);
    }
  }, [avatarQueryResponse]);

  const imageRef = React.useRef<HTMLImageElement>(null);

  const updateAvatarImageSrcAttribute = (src: Response) => {
    if (imageRef.current) {
      imageRef.current.src = src.url;
      imageRef.current.crossOrigin = "anonymous";

      imageRef.current.addEventListener("load", () => {
        setSuccessfullyLoadedAvatar(true);
      });
    }
  };

  const updateShadowColor = () => {
    if (successfullyLoadedAvatar && imageRef.current) {
      const color = fac.getColor(imageRef.current);

      setShadowColor(color.rgba);
    }
  };

  useEffect(() => {
    updateShadowColor();
  }, [successfullyLoadedAvatar]);

  /*
    Start of Avatar scaling logic ⬇️

    isHovered: boolean - Holds the state of the hover event over the Avatar image
    blockHoverInteraction: boolean - Wether the hover event happened in a timestamp between now and AVATAR_SCALING_TIMEOUT ago
    isAvatarScaled: boolean - Wether the Avatar image is scaled up or not in the Ui
  */
  const AVATAR_SCALING_TIMEOUT = 300;

  const [isHovered, setIsHovered] = useState(false);
  const [blockHoverInteraction, setBlockHoverInteraction] = useState(false);
  const [isAvatarScaled, setIsAvatarScaled] = useState(false);

  useEffect(() => {
    if (blockHoverInteraction) {
      return;
    }

    setIsAvatarScaled(isHovered);
  }, [isHovered]);
  useEffect(() => {
    if (isAvatarScaled) {
      setBlockHoverInteraction(true);
    }
  }, [isAvatarScaled]);

  useEffect(() => {
    if (blockHoverInteraction) {
      setTimeout(() => {
        setBlockHoverInteraction(false);
      }, AVATAR_SCALING_TIMEOUT);
    } else {
      if (isHovered !== isAvatarScaled) {
        setIsAvatarScaled(isHovered);
      }
    }
  }, [blockHoverInteraction]);
  /*
    Since some browsers do not correctly trigger mouse events when the target element is scaling up or down,
    the above logic was created to guarantee that the Avatar scaling event is correctly triggered and that the
    Ui always reflects a smooth transition between a scaled up and a scaled down Avatar image. This logic
    separates the hover event from the Ui scaling animation by using a timeout to block the hover event
    from triggering the scaling animation. This way, the misunderdatings between the browser mouse
    events and a scaling Avatar are avoided and the Ui is always consistent.

    End of Avatar scaling logic ⬆️
  */

  {
    /*
      Whenever a user interacts with this component, two things happen:
      1. The avatar scales up (on mouse over) and down (on mouse leave)
      2. The tooltip is displayed (on mouse over) and hidden (on mouse leave)

      These behaviors are reflected in mobile with a tap gesture instead of a hover gesture.

      Since the avatar scaling could move the tooltip up and down while it is being displayed, and
      we need to make sure that the tooltip is displayed at the correct position without layout shifts,
      two animations called animate-scaleAvatar and animate-scaleDownAvatar are used to ensure that the tooltip
      is displayed right after the avatar scaling event has ended. This means that these animations won't
      conflict and thus won't cause UI inconsistencies.

      You can find these animations application in the <Image> component below and its configuration in Tailwind Config file.
      You can find the Tooltip specs in the Tooltip component below and its configuration in Tooltip's props.
    */
  }
  return (
    <Tooltip
      withDelay={true}
      placement="top"
      className={cc([
        className,
        "tooltip-target ml-[2.5%] rounded-xl transition",
        {
          "animate-scaleAvatar": isAvatarScaled,
          "animate-scaleDownAvatar": !isAvatarScaled,
        },
      ])}
      trigger={
        <>
          <img
            data-tip
            ref={imageRef}
            alt={profile.ensName}
            data-for={profile.ensName}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            data-tooltip-id={`${profile.ensName}-${avatarID}`}
            className={cc([
              AvatarSizeStyling[size],
              {
                "opacity-0 bg-transparent invisible absolute animate-loadingScaleDownAvatar":
                  !successfullyLoadedAvatar,
              },
            ])}
            style={{
              borderRadius: "12.31px",
              boxShadow: `0 ${isAvatarScaled ? "6px 12px" : "0"} ${shadowColor}`,
              outline: "1px solid rgba(0,0,0,0.1)",
              outlineOffset: "-1px",
            }}
          />
          <div
            className={cc([
              AvatarSizeStyling[size],
              "bg-gray-100 animate-pulse rounded-xl ml-[2.5%] border-[rgba(0,0,0,0.1)] border",
              {
                "opacity-0 invisible absolute": successfullyLoadedAvatar,
              },
            ])}
          ></div>
        </>
      }
    >
      <div className="flex gap-4 max-w-[375px] md:max-w-[400px] items-stretch py-2">
        <div className="shrink-0 flex flex-grow transition-all duration-200">
          <img
            alt={profile.ensName}
            src={avatarQueryResponse?.url}
            className={cc([AvatarSizeStyling[AvatarSize.SMALL], "rounded-lg"])}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex gap-1 items-center">
            <p className="font-semibold text-lg transition-all duration-200 mr-1 ens-webfont line-clamp-1 break-all">
              {profile.ensName}
            </p>

            <a
              href={`https://app.ens.domains/${profile.ensName}`}
              target="_blank"
              aria-label={"ENS profile"}
            >
              <EnsSolidIcon
                className="hover:brightness-200 transition"
                fill="#AFAFAF"
                height={24}
                width={24}
              />
            </a>

            {profile.twitterProfile && (
              <a
                href={profile.twitterProfile}
                target="_blank"
                aria-label={"Twitter profile"}
              >
                <TwitterIcon className="fill-current text-gray-400 hover:text-white transition-color duration-200" />
              </a>
            )}

            {profile.address && (
              <a
                href={`https://efp.app/${profile.address}`}
                target="_blank"
                aria-label={"EFP profile"}
                className="transition-all duration-300 hover:brightness-100 brightness-75 hover:filter-none grayscale"
              >
                <EfpLogo
                  color="gray"
                  className="w-5 h-5 fill-current text-gray-400 hover:text-white transition-color duration-200"
                />
              </a>
            )}
          </div>
          <ProfileStats
            addressOrName={profile.ensName}
            statsStyle={{
              color: "rgb(156 163 175)",
              fontFamily: "var(--font-inter)",
              fontWeight: "500",
            }}
            containerStyle={{
              marginTop: "4px",
              gap: "16px",
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              color: "#9CA3AF",
            }}
          />

          {profile.displayName && (
            <p className="text-sm font-normal">{profile.displayName}</p>
          )}
          <div className="max-w-[300px] text-gray-400 text-sm">
            {profile.title}
          </div>
        </div>
      </div>
    </Tooltip>
  );
};
