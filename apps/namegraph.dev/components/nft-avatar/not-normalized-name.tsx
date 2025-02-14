import React from "react";
import { AvatarSize } from "./avatar-utils";
import { useScreenSize } from "./use-screen-size";
import { Normalization } from "@namehash/ens-utils";
import cc from "classcat";

interface NotNormalizedNameNftAvatarProps {
  normalization?: Normalization;
  nameDoesntExist?: boolean;
  size: AvatarSize;
}

export const NotNormalizedNameNftAvatar = ({
  normalization,
  nameDoesntExist,
  size,
}: NotNormalizedNameNftAvatarProps) => {
  const { isDesktop, isTablet } = useScreenSize();
  const isSmaller = size === AvatarSize.SMALL || size === AvatarSize.MINI;

  return (
    <div className={`${size} mx-auto relative`}>
      <div
        className={`rounded-[36px] ${
          isSmaller && "border-[#6b72801a] border"
        } ${
          !isSmaller && "shadow-[0_0_30px_3px_rgba(248,113,113,0.6)]"
        } z-30 w-full h-full absolute left-0 top-0`}
      ></div>
      <svg
        viewBox="0 0 480 480"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="relative overflow-visible"
        data-atropos-offset="4"
      >
        <g id="background-layer" data-atropos-offset="-4">
          <rect
            x="0"
            y="0"
            width="480"
            height="480"
            fill={isSmaller ? "#FFF" : "#F87171"}
            rx="52"
          />
        </g>
        <g data-atropos-offset="-2">
          <rect x="0" y="0" width="480" height="480" fill="#FEE2E2" rx="52" />
        </g>
        <g
          className={cc([
            {
              "-translate-x-[68px] -translate-y-[48px]":
                size === AvatarSize.MINI,
              "lg:scale-125 -translate-x-[64px] -translate-y-[44px] lg:-translate-x-[98px] lg:-translate-y-[68px]":
                size === AvatarSize.SMALL,
              "-translate-x-[66px] -translate-y-[46px] lg:scale-90 lg:-translate-x-[54px] lg:-translate-y-[36px]":
                size === AvatarSize.BIG || size === AvatarSize.HUGE,
            },
          ])}
        >
          <path
            d="M136.425 137.647C137.283 139.469 139.408 143.076 139.408 143.076L163.835 102.807L139.968 119.39C138.55 120.32 137.394 121.621 136.574 123.109C134.374 127.682 134.336 133 136.425 137.647Z"
            data-atropos-offset="-2"
            fill="url(#paint0_linear_7947_49435)"
          />
          <path
            d="M126.729 150.884C127.288 158.693 131.166 165.869 137.394 170.592L163.76 188.923C163.76 188.923 147.277 165.2 133.329 141.626C131.912 139.134 130.98 136.42 130.532 133.594C130.346 132.33 130.346 131.028 130.532 129.727C130.159 130.396 129.451 131.772 129.451 131.772C128.034 134.635 127.064 137.721 126.617 140.882C126.393 144.191 126.393 147.575 126.729 150.884Z"
            data-atropos-offset="-2"
            fill={isSmaller ? "#FFF" : "#F87171"}
          />
          <path
            d="M194.006 154.082C193.148 152.26 191.022 148.653 191.022 148.653L166.596 188.923L190.426 172.339C191.843 171.41 192.999 170.108 193.819 168.621C196.057 164.01 196.094 158.693 194.006 154.082Z"
            data-atropos-offset="-2"
            fill="url(#paint1_linear_7947_49435)"
          />
          <path
            d="M203.699 140.808C203.14 132.999 199.261 125.823 193.034 121.1L166.668 102.769C166.668 102.769 183.151 126.492 197.099 150.066C198.516 152.558 199.448 155.272 199.895 158.098C200.082 159.362 200.082 160.663 199.895 161.965C200.268 161.296 200.977 159.92 200.977 159.92C202.394 157.057 203.364 153.97 203.811 150.81C204.035 147.501 204.035 144.154 203.699 140.808Z"
            data-atropos-offset="-2"
            fill={isSmaller ? "#FFF" : "#F87171"}
          />
          <path
            d="M136.574 123.109C137.394 121.621 138.55 120.32 139.967 119.39L163.797 102.807L139.371 143.076C139.371 143.076 137.245 139.469 136.387 137.647C134.299 132.999 134.373 127.682 136.574 123.109ZM126.729 150.885C127.288 158.693 131.166 165.87 137.394 170.592L163.76 188.923C163.76 188.923 147.277 165.2 133.329 141.626C131.912 139.135 130.98 136.42 130.532 133.594C130.346 132.33 130.346 131.029 130.532 129.727C130.159 130.397 129.451 131.772 129.451 131.772C128.034 134.636 127.064 137.722 126.617 140.882C126.393 144.192 126.393 147.575 126.729 150.885ZM193.967 154.082C193.109 152.26 190.983 148.654 190.983 148.654L166.594 188.923L190.424 172.339C191.841 171.41 192.997 170.108 193.817 168.621C196.018 164.048 196.092 158.73 193.967 154.082ZM203.663 140.845C203.103 133.037 199.225 125.86 192.997 121.138L166.669 102.807C166.669 102.807 183.152 126.53 197.099 150.104C198.516 152.595 199.449 155.309 199.896 158.135C200.083 159.4 200.083 160.701 199.896 162.002C200.269 161.333 200.978 159.957 200.978 159.957C202.395 157.094 203.364 154.008 203.812 150.847C204.073 147.501 204.073 144.154 203.737 140.808L203.663 140.845Z"
            data-atropos-offset="-2"
            fill={isSmaller ? "#FFF" : "#F87171"}
          />
        </g>
        <g>
          {!isSmaller && (
            <text
              x="14%"
              textAnchor="left"
              y="412"
              fontFamily="Inter"
              fontSize="48"
              fill="#F87171"
              fontWeight="600"
              data-atropos-offset="-2"
            >
              {nameDoesntExist
                ? "Not found"
                : normalization === Normalization.Unknown
                  ? "Unknown name"
                  : "Invalid name"}
            </text>
          )}
        </g>
      </svg>
    </div>
  );
};
