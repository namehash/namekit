import { type SVGProps } from "react";

export function RadioIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="0.625"
        y="0.625"
        width="18.75"
        height="18.75"
        rx="9.375"
        fill="white"
      />
      <rect
        x="0.625"
        y="0.625"
        width="18.75"
        height="18.75"
        rx="9.375"
        stroke="#DBDBDB"
        strokeWidth="1.25"
      />
    </svg>
  );
}

export default RadioIcon;
