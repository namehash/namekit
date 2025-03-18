import { SVGProps } from "react";

export const NameGraphIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M8 5L14 14M14 14H25M14 14L8 23" stroke="black" strokeWidth="2" />
      <circle cx="8" cy="5" r="3" fill="black" />
      <circle cx="20" cy="5" r="3" fill="black" />
      <circle cx="8" cy="23" r="3" fill="black" />
      <circle cx="3" cy="14" r="3" fill="black" />
      <circle cx="14" cy="14" r="4" fill="black" />
      <circle cx="25" cy="14" r="3" fill="black" />
      <circle cx="20" cy="23" r="3" fill="black" />
    </svg>
  );
};
