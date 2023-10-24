import * as React from "react";

export const WarnShieldLarge = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={68}
    height={71}
    fill="none"
    {...props}
  >
    <g filter="url(#a)">
      <path
        fill="#F59E0B"
        stroke="#fff"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M36.407 4.697a3.5 3.5 0 0 0-4.814 0 28.39 28.39 0 0 1-19.955 7.801 3.5 3.5 0 0 0-3.369 2.407A35.471 35.471 0 0 0 6.5 26c0 16.547 11.317 30.441 26.628 34.382a3.5 3.5 0 0 0 1.744 0C50.182 56.442 61.5 42.547 61.5 26c0-3.869-.62-7.6-1.77-11.095a3.5 3.5 0 0 0-3.368-2.407c-.12.002-.241.002-.362.002a28.39 28.39 0 0 1-19.593-7.803ZM34 23.5a.5.5 0 0 1 .5.5v10a.5.5 0 1 1-1 0V24a.5.5 0 0 1 .5-.5ZM33.5 42a.5.5 0 0 1 .5-.5h.02a.5.5 0 0 1 .5.5v.02a.5.5 0 0 1-.5.5H34a.5.5 0 0 1-.5-.5V42Z"
      />
    </g>
    <defs>
      <filter
        id="a"
        width={74}
        height={74}
        x={-3}
        y={-1}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feMorphology
          in="SourceAlpha"
          radius={1}
          result="effect1_dropShadow_405_7373"
        />
        <feOffset dy={2} />
        <feGaussianBlur stdDeviation={2} />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_405_7373"
        />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feMorphology
          in="SourceAlpha"
          radius={1}
          result="effect2_dropShadow_405_7373"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={3} />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
        <feBlend
          in2="effect1_dropShadow_405_7373"
          result="effect2_dropShadow_405_7373"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect2_dropShadow_405_7373"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
