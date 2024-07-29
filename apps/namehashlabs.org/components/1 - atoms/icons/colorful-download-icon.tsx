import { SVGProps } from "react";

export const ColorfulDownloadIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      {...props}
    >
      <path
        d="M6 33V37.5C6 39.9853 8.01472 42 10.5 42H37.5C39.9853 42 42 39.9853 42 37.5V33M33 24L24 33M24 33L15 24M24 33V6"
        stroke="url(#paint0_linear_4861_36628)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_4861_36628"
          x1="24"
          y1="6"
          x2="24"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFAF00" />
          <stop offset="1" stopColor="#F112D9" />
        </linearGradient>
      </defs>
    </svg>
  );
};
