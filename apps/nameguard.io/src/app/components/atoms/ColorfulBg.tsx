import { SVGProps } from "react";

export const ColorfulBg = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 1440 370"
      fill="none"
      // preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g opacity="0.15">
        <rect
          y="370"
          width="370"
          height="1440"
          transform="rotate(-90 0 370)"
          fill="url(#paint0_linear_4888_38355)"
        />
        <rect
          y="370"
          width="370"
          height="1440"
          transform="rotate(-90 0 370)"
          fill="url(#paint1_linear_4888_38355)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_4888_38355"
          x1="185"
          y1="370"
          x2="185"
          y2="1810"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFAF00" />
          <stop offset="0.322917" stopColor="#F112D9" />
          <stop offset="0.708333" stopColor="#4C3FA0" />
          <stop offset="0.958333" stopColor="#2ED3C6" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_4888_38355"
          x1="370"
          y1="1810"
          x2="92.9625"
          y2="1810"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F9FAFB" stopOpacity="0" />
          <stop offset="1" stopColor="#F9FAFB" />
        </linearGradient>
      </defs>
    </svg>
  );
};
