import React, { type SVGProps, useId } from "react";

export const NormalizedNameEnsAvatar = (props: SVGProps<SVGSVGElement>) => {
  /*
    Due to the possibility of existance of multiple instances of this component in the same page,
    an unique ID is generated for each instance so that the SVG filters ids don't clash.
  */
  const normalizedNamePlaceholderAvatarID = useId();

  return (
    <svg {...props} viewBox="0 0 270 270" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          id="dropShadow"
          height="270"
          width="270"
        >
          <feDropShadow
            dx="0"
            dy="1"
            stdDeviation="2"
            floodOpacity="0.225"
            width="200%"
            height="200%"
          />
        </filter>
      </defs>
      <defs>
        <linearGradient
          id={`paint0_linear-${normalizedNamePlaceholderAvatarID}`}
          gradientUnits="userSpaceOnUse"
          y2="-172.5"
          x1="190.5"
          y1="302"
          x2="-64"
        >
          <stop stopColor="#44BCF0" />
          <stop offset="0.428185" stopColor="#628BF3" />
          <stop offset="1" stopColor="#A099FF" />
        </linearGradient>
        <linearGradient
          x1="0"
          y1="0"
          x2="269.553"
          y2="285.527"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EB9E9E" />
          <stop offset="1" stopColor="#992222" />
        </linearGradient>
      </defs>
      <rect
        width="270"
        height="270"
        fill={`url(#paint0_linear-${normalizedNamePlaceholderAvatarID})`}
      />
    </svg>
  );
};
