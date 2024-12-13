import { type SVGProps } from "react";

export const ColorfulBackgroundMobile = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 375 594"
      fill="none"
      {...props}
    >
      <g opacity="0.2">
        <path
          d="M0 8.71229e-08L375 0L375 594L0 594L0 8.71229e-08Z"
          fill="url(#paint0_linear_2335_22091)"
        />
        <path
          d="M0 8.71229e-08L375 0L375 594L0 594L0 8.71229e-08Z"
          fill="url(#paint1_linear_2335_22091)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_2335_22091"
          x1="186.9"
          y1="-8.71221e-08"
          x2="186.9"
          y2="593"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF9E00" />
          <stop offset="0.322917" stopColor="#F112D9" />
          <stop offset="0.708333" stopColor="#4C3FA0" />
          <stop offset="0.958333" stopColor="#2ED3C6" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_2335_22091"
          x1="-0.622935"
          y1="296.5"
          x2="394.041"
          y2="296.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ColorfulBackgroundMobile;
