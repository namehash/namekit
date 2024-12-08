import { type SVGProps } from "react";

export const NoFillPriceTagIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5 5H5.01M5 1H10C10.5119 0.999985 11.0237 1.19525 11.4142 1.58579L18.4143 8.58579C19.1953 9.36684 19.1953 10.6332 18.4143 11.4142L11.4142 18.4142C10.6332 19.1953 9.36683 19.1953 8.58579 18.4142L1.58579 11.4142C1.19526 11.0237 1 10.5118 1 10V5C1 2.79086 2.79086 1 5 1Z"
        stroke="#272727"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
