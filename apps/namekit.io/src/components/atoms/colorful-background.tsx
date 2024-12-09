import { type SVGProps } from "react";

export const ColorfulBackground = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 1440 651"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g opacity="0.2">
        <path
          d="M4.37114e-08 651L-2.84561e-05 6.10352e-05L1440 -1.90924e-06L1440 651L4.37114e-08 651Z"
          fill="url(#paint0_linear_2152_23712)"
        />
        <path
          d="M4.37114e-08 651L-2.84561e-05 6.10352e-05L1440 -1.90924e-06L1440 651L4.37114e-08 651Z"
          fill="url(#paint1_linear_2152_23712)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_2152_23712"
          x1="-1.42499e-05"
          y1="326"
          x2="1440"
          y2="326"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF9E00" />
          <stop offset="0.322917" stopColor="#F112D9" />
          <stop offset="0.708333" stopColor="#4C3FA0" />
          <stop offset="0.958333" stopColor="#2ED3C6" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_2152_23712"
          x1="720"
          y1="651"
          x2="720"
          y2="-33"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ColorfulBackground;
