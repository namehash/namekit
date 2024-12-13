import { type SVGProps } from "react";

export const MirrorLogo = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      {...props}
    >
      <path
        d="M6 14.7097C6 7.12445 12.0576 1 19.5 1C26.9424 1 33 7.12445 33 14.7097V35.7648C33 36.4605 32.4478 37 31.7964 37H7.20344C6.55225 37 6 36.4605 6 35.7648V14.7097Z"
        fill="url(#paint0_linear_1849_52934)"
        stroke="white"
        strokeWidth="2"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1849_52934"
          x1="12"
          y1="4.5"
          x2="32.4047"
          y2="35.7357"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#2081E2" />
        </linearGradient>
      </defs>
    </svg>
  );
};
