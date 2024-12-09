import { type SVGProps } from "react";

export const CopyIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5 13H3C1.89543 13 1 12.1046 1 11V3C1 1.89543 1.89543 1 3 1H11C12.1046 1 13 1.89543 13 3V5M7 17H15C16.1046 17 17 16.1046 17 15V7C17 5.89543 16.1046 5 15 5H7C5.89543 5 5 5.89543 5 7V15C5 16.1046 5.89543 17 7 17Z"
        stroke={props.stroke ? props.stroke : "black"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
