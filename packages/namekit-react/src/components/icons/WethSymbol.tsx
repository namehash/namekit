import React, { type SVGProps } from "react";

export const WethSymbol = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg {...props} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.10071 1.79346L8.01562 2.07919V10.3705L8.10071 10.4545L11.9964 8.17946L8.10071 1.79346Z"
        fill={props.fill ? props.fill : "#DA3979"}
      />
      <path
        d="M8.10272 1.79346L4.20703 8.17946L8.10272 10.4545V6.43012V1.79346Z"
        fill={props.fill ? props.fill : "#E781A9"}
      />
      <path
        d="M8.10264 11.183L8.05469 11.2408V14.1943L8.10264 14.3327L12.0006 8.90918L8.10264 11.183Z"
        fill={props.fill ? props.fill : "#DA3979"}
      />
      <path
        d="M8.10272 14.3327V11.183L4.20703 8.90918L8.10272 14.3327Z"
        fill={props.fill ? props.fill : "#E781A9"}
      />
      <path
        d="M8.10156 10.454L11.9972 8.17906L8.10156 6.42969V10.454Z"
        fill={props.fill ? props.fill : "#671334"}
      />
      <path
        d="M4.20703 8.17906L8.10267 10.454V6.42969L4.20703 8.17906Z"
        fill={props.fill ? props.fill : "#DA3979"}
      />
    </svg>
  );
};
