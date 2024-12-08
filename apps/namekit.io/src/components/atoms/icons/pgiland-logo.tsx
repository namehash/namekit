import { type SVGProps } from "react";

export const ExternalLinkIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      {...props}
    >
      <path
        d="M18 0L36 9V27L18 36L0 27V9L18 0ZM34.56 10.44L18.72 18.36V34.2L34.56 26.28V10.44ZM25.2 18.72V24.48L22.32 25.92V20.16L25.2 18.72ZM30.96 15.84V21.6L28.08 23.04V17.28L30.96 15.84Z"
        fill="#8080FF"
      />
    </svg>
  );
};
