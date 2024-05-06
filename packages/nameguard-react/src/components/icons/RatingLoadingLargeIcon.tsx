import * as React from "react";

export const RatingLoadingLargeIcon = (props) => (
  <svg
    width="68"
    height="71"
    viewBox="0 0 68 71"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="animate-pulse"
    {...props}
  >
    <g filter="url(#filter0_dd_405_7380)">
      <path
        d="M36.4067 4.69655C35.0569 3.41821 32.9431 3.41821 31.5933 4.69655C26.4828 9.53645 19.5913 12.4998 12 12.4998C11.8791 12.4998 11.7584 12.499 11.6379 12.4975C10.1101 12.4786 8.74667 13.4527 8.26948 14.9041C7.12028 18.3995 6.5 22.1307 6.5 25.9999C6.5 42.5465 17.8171 56.4407 33.1276 60.3813C33.6999 60.5286 34.3001 60.5286 34.8724 60.3813C50.1829 56.4407 61.5 42.5465 61.5 25.9999C61.5 22.1307 60.8797 18.3995 59.7305 14.9041C59.2533 13.4527 57.8899 12.4786 56.3622 12.4975C56.2416 12.499 56.1209 12.4998 56 12.4998C48.4087 12.4998 41.5172 9.53645 36.4067 4.69655Z"
        fill="url(#paint0_linear_405_7380)"
        stroke="white"
        strokeWidth="3"
      />
    </g>
    <defs>
      <filter
        id="filter0_dd_405_7380"
        x="-3"
        y="-1"
        width="74"
        height="74"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="1"
          operator="erode"
          in="SourceAlpha"
          result="effect1_dropShadow_405_7380"
        />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="2" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_405_7380"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="1"
          operator="erode"
          in="SourceAlpha"
          result="effect2_dropShadow_405_7380"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="3" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow_405_7380"
          result="effect2_dropShadow_405_7380"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect2_dropShadow_405_7380"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_405_7380"
        x1="8"
        y1="8.03748"
        x2="61.8868"
        y2="10.4025"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#000000" stopOpacity="0.2" />
        <stop offset="1" stopColor="#000000" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);
