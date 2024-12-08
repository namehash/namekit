import { type SVGProps } from "react";

export const FunnelIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className="w-3 fill-current text-gray-400"
      viewBox="0 0 14 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#808080"
        d="M0 1C0 0.447715 0.447715 0 1 0H13C13.5523 0 14 0.447715 14 1V4C14 4.26522 13.8946 4.51957 13.7071 4.70711L9 9.41421V13C9 13.2652 8.89464 13.5196 8.70711 13.7071L6.70711 15.7071C6.42111 15.9931 5.99099 16.0787 5.61732 15.9239C5.24364 15.7691 5 15.4045 5 15V9.41421L0.292893 4.70711C0.105357 4.51957 0 4.26522 0 4V1Z"
      />
    </svg>
  );
};
