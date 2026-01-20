import React, { type SVGProps } from "react";

const ETH_DEFAULT_COLOR = "#272727";

export const EthIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={props.fill ? props.fill : ETH_DEFAULT_COLOR}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.31264 12.2692L12.156 2.69043L17.9994 12.2693L17.9995 12.2693L17.9995 12.2693L17.9996 12.2694L12.156 15.6819L12.156 15.682L6.3125 12.2694L6.31258 12.2693L6.3125 12.2693L6.31264 12.2692ZM12.156 21.4995L12.1561 21.4995L18.0031 13.3642L12.1561 16.7749L12.156 16.775V16.7749L6.3125 13.3642L12.156 21.4995Z"
      />
    </svg>
  );
};
