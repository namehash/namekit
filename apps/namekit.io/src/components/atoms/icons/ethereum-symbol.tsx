import { type SVGProps } from "react";

export const EthereumSymbol = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-3 fill-current"
      viewBox="0 0 12 20"
      fill="none"
      {...props}
    >
      <path d="M0 10L6 0L12 10L6 14L0 10Z" />
      <path d="M0 11.5L6 15.5L12 11.5L6 20L0 11.5Z" />
    </svg>
  );
};
