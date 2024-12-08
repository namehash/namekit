import { type SVGProps } from "react";

export function RadioCheckedIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="20" height="20" rx="10" fill="black" />
      <circle cx="10" cy="10" r="3.75" fill="white" />
    </svg>
  );
}

export default RadioCheckedIcon;
