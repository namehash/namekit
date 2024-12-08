import { type SVGProps } from "react";

export function TransferArrowsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5 5L17 5M17 5L13 1M17 5L13 9M13 15L0.999999 15M0.999999 15L5 19M0.999999 15L5 11"
        stroke="#808080"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default TransferArrowsIcon;
