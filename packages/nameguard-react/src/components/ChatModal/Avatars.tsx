import React from "react";

export const AvatarIcons = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    height="49"
    viewBox="0 0 80 49"
    width="80"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <filter
      id="a"
      colorInterpolationFilters="sRGB"
      filterUnits="userSpaceOnUse"
      height="33.625"
      width="33.625"
      x="39.1875"
      y="8.5625"
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
        radius="0.4375"
        result="effect1_dropShadow_2355_13797"
      />
      <feOffset dy=".875" />
      <feGaussianBlur stdDeviation=".875" />
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"
      />
      <feBlend
        in2="BackgroundImageFix"
        mode="normal"
        result="effect1_dropShadow_2355_13797"
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
        radius="0.4375"
        result="effect2_dropShadow_2355_13797"
      />
      <feOffset dy=".875" />
      <feGaussianBlur stdDeviation="2.625" />
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 0.0196078 0 0 0 0 0.588235 0 0 0 0 0.411765 0 0 0 0.1 0"
      />
      <feBlend
        in2="effect1_dropShadow_2355_13797"
        mode="normal"
        result="effect2_dropShadow_2355_13797"
      />
      <feBlend
        in="SourceGraphic"
        in2="effect2_dropShadow_2355_13797"
        mode="normal"
        result="shape"
      />
    </filter>
    <linearGradient
      id="b"
      gradientUnits="userSpaceOnUse"
      x1="56"
      x2="56"
      y1="14.375"
      y2="34.625"
    >
      <stop offset="0" stopColor="#464646" />
      <stop offset="1" />
    </linearGradient>
    <clipPath id="c">
      <path d="m0 4.5h40v40h-40z" />
    </clipPath>
    <mask id="d" height="41" maskUnits="userSpaceOnUse" width="40" x="0" y="4">
      <path
        d="m40 24.5c0-11.0457-8.9543-20-20-20s-20 8.9543-20 20 8.9543 20 20 20 20-8.9543 20-20z"
        fill="#fff"
      />
    </mask>
    <g clip-path="url(#c)">
      <g mask="url(#d)">
        <path d="m40 4.5h-40v40h40z" fill="#969697" />
        <path
          d="m34.9361 4.11835-28.25436 15.02305c-3.9011 2.0743-5.38206 6.9183-3.3078 10.8194l15.02306 28.2543c2.0743 3.9011 6.9183 5.3821 10.8194 3.3078l28.2543-15.0231c3.9011-2.0742 5.3821-6.9182 3.3078-10.8193l-15.0231-28.25434c-2.0742-3.90111-6.9182-5.38206-10.8193-3.30781z"
          fill="#252525"
        />
        <g fill="#fff">
          <path d="m19.0088 31.3586c.0386 1.1044.6605 2.1432 1.729 2.8877 1.0685.7446 2.496 1.134 3.9686 1.0826 1.4725-.0514 2.8694-.5395 3.8834-1.3568 1.0139-.8172 1.5619-1.8968 1.5233-3.0012" />
          <path d="m19.3314 24.6765c-.0214-.6132-.4117-1.0974-.8716-1.0813-.46.016-.8155.5262-.7941 1.1395s.4117 1.0974.8716 1.0814c.46-.0161.8155-.5263.7941-1.1396z" />
          <path d="m30.4359 24.2888c-.0214-.6132-.4117-1.0974-.8716-1.0813-.46.0161-.8155.5262-.7941 1.1395s.4117 1.0974.8716 1.0814c.46-.0161.8155-.5263.7941-1.1396z" />
        </g>
      </g>
    </g>
    <rect fill="#f6f6f6" height="44" rx="22" width="44" x="34" y="2.5" />
    <rect
      height="44"
      rx="22"
      stroke="#fff"
      strokeWidth="4"
      width="44"
      x="34"
      y="2.5"
    />
    <g filter="url(#a)">
      <path
        d="m47.6126 17.3118c-.5183-.0065-.9809.324-1.1428.8165-.4269 1.2983-.6573 2.6843-.6573 4.1219 0 6.1465 4.204 11.308 9.8915 12.7719.1942.05.3978.05.592 0 5.6875-1.4639 9.8915-6.6254 9.8915-12.7719 0-1.4376-.2304-2.8236-.6573-4.1219-.1619-.4925-.6245-.823-1.1428-.8165l.0054.4374-.0054-.4374c-.0458.0005-.0915.0008-.1374.0008-2.88 0-5.4947-1.1244-7.4334-2.9605-.458-.4337-1.1752-.4337-1.6332 0-1.9387 1.8361-4.5534 2.9605-7.4334 2.9605-.0459 0-.0916-.0003-.1374-.0008zm7.2323 9.3412c.091.0909.2173.1373.3455.1266.1281-.0106.2452-.077.3199-.1817l3.2354-4.5295c.1003-.1405.2955-.173.4359-.0727.1405.1003.173.2955.0727.4359l.356.2543-.356-.2543-3.75 5.25c-.0534.0748-.137.1223-.2285.1298-.0916.0076-.1818-.0255-.2468-.0904l-2.25-2.25c-.122-.1221-.122-.3199 0-.442.1221-.122.3199-.122.442 0z"
        fill="url(#b)"
        stroke="#fff"
        strokeLinejoin="round"
        strokeWidth=".875"
      />
      <path
        clipRule="evenodd"
        d="m59.6103 22.686c.2408-.3371.1627-.8055-.1744-1.0462-.337-.2408-.8054-.1627-1.0462.1743l-3.2354 4.5296-1.624-1.624c-.2929-.2929-.7677-.2929-1.0606 0s-.2929.7678 0 1.0607l2.25 2.25c.1559.1559.3724.2353.5922.2171.2197-.0182.4203-.1321.5484-.3115z"
        fill="#fff"
        fillRule="evenodd"
      />
    </g>
  </svg>
);
