import { SVGProps } from "react";

export const EnsIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="47"
      height="52"
      viewBox="0 0 47 52"
      fill="none"
      {...props}
    >
      <g filter="url(#filter0_dd_3080_19306)">
        <path
          d="M10.691 13.3898C11.0595 12.7217 11.5788 12.1371 12.2153 11.7196L22.9191 4.27051L11.9473 22.3587C11.9473 22.3587 10.9925 20.7386 10.6072 19.9202C9.66917 17.8325 9.70267 15.4441 10.691 13.3898ZM6.26874 25.8661C6.52 29.3735 8.26209 32.597 11.0595 34.7181L22.9024 42.9522C22.9024 42.9522 15.4985 32.2964 9.23365 21.7073C8.59711 20.5883 8.17834 19.3691 7.97733 18.0997C7.89357 17.5318 7.89357 16.9473 7.97733 16.3627C7.80982 16.6633 7.49155 17.2813 7.49155 17.2813C6.85502 18.5674 6.41949 19.9536 6.21848 21.3733C6.11798 22.8598 6.11798 24.3796 6.26874 25.8661ZM36.4706 27.3025C36.0854 26.4841 35.1306 24.864 35.1306 24.864L24.1755 42.9522L34.8793 35.5031C35.5158 35.0856 36.0351 34.501 36.4036 33.8329C37.3919 31.7786 37.4254 29.3902 36.4706 27.3025ZM40.8259 21.3566C40.5746 17.8492 38.8325 14.6257 36.0351 12.5046L24.209 4.27051C24.209 4.27051 31.6129 14.9263 37.8777 25.5154C38.5142 26.6344 38.933 27.8536 39.134 29.123C39.2178 29.6908 39.2178 30.2754 39.134 30.86C39.3015 30.5593 39.6198 29.9414 39.6198 29.9414C40.2563 28.6553 40.6919 27.2691 40.8929 25.8494C41.0101 24.3462 41.0101 22.8431 40.8594 21.3399L40.8259 21.3566Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_dd_3080_19306"
          x="1.14844"
          y="3.27051"
          width="44.8281"
          height="48.6816"
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
            result="effect1_dropShadow_3080_19306"
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
            result="effect1_dropShadow_3080_19306"
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
            result="effect2_dropShadow_3080_19306"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="3" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_3080_19306"
            result="effect2_dropShadow_3080_19306"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_3080_19306"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
