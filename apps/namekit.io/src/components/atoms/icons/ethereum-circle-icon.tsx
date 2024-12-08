import { type SVGProps } from "react";

interface LogoProps extends SVGProps<SVGSVGElement> {
  isSmallIcon?: boolean;
}

export function EthereumCircleIcon(props: LogoProps) {
  return (
    <>
      {props.isSmallIcon ? (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="48" height="48" rx="24" fill="#F6F6F6" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.3094 24.0037L24.1527 13.0811V13.0812L24.1528 13.0811L30.996 24.0037L30.9957 24.0039L30.9958 24.0039L24.1527 28.0001V27.9999L24.1527 27.9999V28L24.1526 28V28.0001L17.3095 24.0039L17.3097 24.0038L17.3094 24.0037ZM24.1527 35.1079L17.3095 25.5809L24.1527 29.5752L31 25.5809L24.1527 35.108L24.1527 35.1079L24.1527 35.1079Z"
            fill="black"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.31264 12.2692L12.156 2.69043L17.9994 12.2693L17.9995 12.2693L17.9995 12.2693L17.9996 12.2694L12.156 15.6819L12.156 15.682L6.3125 12.2694L6.31258 12.2693L6.3125 12.2693L6.31264 12.2692ZM12.156 21.4995L12.1561 21.4995L18.0031 13.3642L12.1561 16.7749L12.156 16.775V16.7749L6.3125 13.3642L12.156 21.4995Z"
            fill={props.fill ? props.fill : "#808080"}
          />
        </svg>
      )}
    </>
  );
}

export default EthereumCircleIcon;
