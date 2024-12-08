import { type SVGProps } from "react";

export function PriceTagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.7071 7.29289C16.0976 7.68342 16.0976 8.31658 15.7071 8.70711L8.70711 15.7071C8.31658 16.0976 7.68342 16.0976 7.29289 15.7071L0.292893 8.70711C0.0976 8.51181 -3.1133e-05 8.25584 7.44694e-09 7.99988V3C7.44694e-09 1.34315 1.34315 0 3 0H8.00027C8.2561 6.96388e-05 8.51191 0.0977007 8.70711 0.292893L15.7071 7.29289ZM3 4C3.55228 4 4 3.55228 4 3C4 2.44772 3.55228 2 3 2C2.44772 2 2 2.44772 2 3C2 3.55228 2.44772 4 3 4Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default PriceTagIcon;
