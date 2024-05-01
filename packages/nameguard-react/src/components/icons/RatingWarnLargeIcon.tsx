import * as React from "react";

export const RatingWarnLargeIcon = (props) => (
  <svg
    fill="none"
    height="71"
    viewBox="0 0 68 71"
    width="68"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <filter
      id="a"
      colorInterpolationFilters="sRGB"
      filterUnits="userSpaceOnUse"
      height="74"
      width="74"
      x="-3"
      y="-1"
    >
      <feFlood floodOpacity="0" result="BackgroundImageFix" />
      <feColorMatrix
        in="SourceAlpha"
        result="hardAlpha"
        type="matrix"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
      />
      <feMorphology
        in="SourceAlpha"
        operator="erode"
        radius="1"
        result="effect1_dropShadow_1176_4999"
      />
      <feOffset dy="2" />
      <feGaussianBlur stdDeviation="2" />
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"
      />
      <feBlend
        in2="BackgroundImageFix"
        mode="normal"
        result="effect1_dropShadow_1176_4999"
      />
      <feColorMatrix
        in="SourceAlpha"
        result="hardAlpha"
        type="matrix"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
      />
      <feMorphology
        in="SourceAlpha"
        operator="erode"
        radius="1"
        result="effect2_dropShadow_1176_4999"
      />
      <feOffset dy="4" />
      <feGaussianBlur stdDeviation="3" />
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
      />
      <feBlend
        in2="effect1_dropShadow_1176_4999"
        mode="normal"
        result="effect2_dropShadow_1176_4999"
      />
      <feBlend
        in="SourceGraphic"
        in2="effect2_dropShadow_1176_4999"
        mode="normal"
        result="shape"
      />
    </filter>
    <g clipRule="evenodd" fillRule="evenodd" filter="url(#a)">
      <path
        d="m35.3752 5.78614c-.7713-.73048-1.9791-.73048-2.7504 0-5.3781 5.09326-12.6348 8.21416-20.6248 8.21416-.1271 0-.254-.0008-.3808-.0024-.873-.0108-1.65208.5458-1.92476 1.3752-1.10011 3.346-1.69444 6.9193-1.69444 10.6273 0 15.8454 10.8375 29.1545 25.5015 32.9287.327.0842.67.0842.997 0 14.664-3.7742 25.5015-17.0833 25.5015-32.9287 0-3.708-.5943-7.2813-1.6944-10.6273-.2727-.8294-1.0518-1.386-1.9248-1.3752-.1267.0016-.2537.0024-.3808.0024-7.99 0-15.2467-3.1209-20.6248-8.21416z"
        fill="#f59e0b"
      />
      <g fill="#fff">
        <path d="m34 22.002c1.1046 0 2 .8954 2 2v10c0 1.1045-.8954 2-2 2s-2-.8955-2-2v-10c0-1.1046.8954-2 2-2zm0 18c-1.1046 0-2 .8954-2 2v.02c0 1.1045.8954 2 2 2h.02c1.1046 0 2-.8955 2-2v-.02c0-1.1046-.8954-2-2-2z" />
        <path d="m11.6565 10.9981c.1143.0015.2288.0022.3435.0022 7.1926 0 13.7189-2.80581 18.5619-7.39236 1.9283-1.82621 4.9479-1.82621 6.8762 0 4.843 4.58655 11.3693 7.39236 18.5619 7.39236.1147 0 .2292-.0007.3435-.0022l.0373 2.9998c-.1267.0016-.2537.0024-.3808.0024-7.99 0-15.2467-3.1209-20.6248-8.21416-.7713-.73048-1.9791-.73048-2.7504 0-5.3781 5.09326-12.6348 8.21416-20.6248 8.21416-.1271 0-.254-.0008-.3808-.0024-.873-.0108-1.65208.5458-1.92476 1.3752-1.10011 3.346-1.69444 6.9193-1.69444 10.6273 0 15.8454 10.8375 29.1545 25.5015 32.9287.327.0842.67.0842.997 0 14.664-3.7742 25.5015-17.0833 25.5015-32.9287 0-3.708-.5943-7.2813-1.6944-10.6273-.2727-.8294-1.0518-1.386-1.9248-1.3752l-.0373-2.9998c2.1824-.0271 4.1303 1.3646 4.812 3.438 1.1983 3.6447 1.8445 7.534 1.8445 11.5643 0 17.2477-11.7968 31.727-27.7537 35.834-.8175.2105-1.6751.2105-2.4926 0-15.9569-4.107-27.7537-18.5863-27.7537-35.834 0-4.0303.64623-7.9196 1.84452-11.5643.6817-2.0734 2.62954-3.4651 4.81198-3.438z" />
      </g>
    </g>
  </svg>
);
