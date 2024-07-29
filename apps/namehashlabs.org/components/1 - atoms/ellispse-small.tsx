import { SVGProps } from "react";

export const EllipseSmall = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 720 250"
      fill="none"
      {...props}
    >
      <g opacity="0.3">
        <path
          d="M360.411 0.987793C203.445 0.987793 67.6958 91.5774 2.87099 223.189C-3.2699 235.656 6.16535 249.712 20.0633 249.712H700.758C714.656 249.712 724.091 235.656 717.951 223.189C653.126 91.5775 517.377 0.987793 360.411 0.987793Z"
          fill="url(#paint0_linear_3654_43898)"
        />
        <path
          d="M360.411 0.987793C203.445 0.987793 67.6958 91.5774 2.87099 223.189C-3.2699 235.656 6.16535 249.712 20.0633 249.712H700.758C714.656 249.712 724.091 235.656 717.951 223.189C653.126 91.5775 517.377 0.987793 360.411 0.987793Z"
          fill="white"
          fillOpacity="0.8"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_3654_43898"
          x1="360.411"
          y1="0.987793"
          x2="360.411"
          y2="249.712"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F113D9" />
          <stop offset="1" stopColor="#4E3FA1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};
