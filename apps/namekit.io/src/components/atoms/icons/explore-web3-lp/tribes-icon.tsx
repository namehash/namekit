import { type SVGProps } from "react";

export const TribesIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 0H6V6H12V12H6H0V6V0ZM12 0H18V6H24V12H18V18H12V12V6V0ZM30 0H24V6V12H30V6V0ZM0 18H6H12V24H6V30H0V24V18ZM12 18H18H24V24H18V30H12V24V18ZM24 18H30V24V30H24V24V18Z"
        fill="black"
      />
    </svg>
  );
};
