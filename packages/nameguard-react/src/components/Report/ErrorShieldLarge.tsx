import * as React from "react";

export const ErrorShieldLarge = (props) => (
  <svg
    width="68"
    height="72"
    viewBox="0 0 68 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#filter0_dd_405_7376)">
      <path
        d="M36.4067 4.7679C35.0569 3.48956 32.9431 3.48956 31.5933 4.7679C26.4828 9.6078 19.5913 12.5711 12 12.5711C11.8791 12.5711 11.7584 12.5704 11.6379 12.5689C10.1101 12.5499 8.74667 13.5241 8.26948 14.9755C7.12028 18.4708 6.5 22.2021 6.5 26.0713C6.5 42.6178 17.8171 56.512 33.1276 60.4527C33.6999 60.5999 34.3001 60.5999 34.8724 60.4527C50.1829 56.512 61.5 42.6178 61.5 26.0713C61.5 22.2021 60.8797 18.4708 59.7305 14.9755C59.2533 13.5241 57.8899 12.5499 56.3622 12.5689C56.2416 12.5704 56.1209 12.5711 56 12.5711C48.4087 12.5711 41.5172 9.6078 36.4067 4.7679Z"
        fill="#DBDBDB"
        stroke="white"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29.317 24.5554C31.6872 22.4815 35.6266 22.4815 37.9967 24.5554C40.2103 26.4923 40.2103 29.5077 37.9967 31.4446C37.5936 31.7973 37.1423 32.0927 36.6552 32.3284C34.5729 33.3362 31.8929 35.4059 31.6716 38.5768C31.6619 38.497 31.6569 38.4158 31.6569 38.3333V39C31.6569 38.8568 31.6619 38.7158 31.6716 38.5768C31.7917 39.5666 32.6347 40.3333 33.6569 40.3333C34.7615 40.3333 35.6569 39.4379 35.6569 38.3333V39C35.6569 37.9925 36.5943 36.8017 38.3977 35.929C39.1925 35.5443 39.9463 35.0538 40.6308 34.4549C44.6656 30.9244 44.6656 25.0756 40.6308 21.5451C36.7525 18.1516 30.5613 18.1516 26.683 21.5451C25.8517 22.2725 25.7675 23.536 26.4949 24.3673C27.2222 25.1985 28.4858 25.2828 29.317 24.5554ZM35.6563 46.3333C35.6563 47.4379 34.7608 48.3333 33.6563 48.3333C32.5517 48.3333 31.6563 47.4379 31.6563 46.3333C31.6563 45.2288 32.5517 44.3333 33.6563 44.3333C34.7608 44.3333 35.6563 45.2288 35.6563 46.3333Z"
        fill="white"
      />
    </g>
    <defs>
      <filter
        id="filter0_dd_405_7376"
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
          result="effect1_dropShadow_405_7376"
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
          result="effect1_dropShadow_405_7376"
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
          result="effect2_dropShadow_405_7376"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="3" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow_405_7376"
          result="effect2_dropShadow_405_7376"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect2_dropShadow_405_7376"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
