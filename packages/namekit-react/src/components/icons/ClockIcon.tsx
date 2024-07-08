import React, { useState } from "react";
import cc from "classcat";

export enum ClockUrgency {
  High = "nk-text-red-500",
  Low = "nk-text-gray-300",
}

const ClockUrgencyHover: Record<ClockUrgency, string> = {
  [ClockUrgency.High]: "hover:nk-text-red-600",
  [ClockUrgency.Low]: "hover:nk-text-gray-400",
};

export const ClockIcon = ({
  clockUrgency,
  withPointerCursor = false,
}: {
  clockUrgency: ClockUrgency;
  withPointerCursor: boolean;
}) => {
  const hoverColor = ClockUrgencyHover[clockUrgency];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cc([
        "nk-h-5 nk-w-5 nk-flex nk-items-center nk-justify-center",
        {
          "nk-cursor-pointer": withPointerCursor,
        },
      ])}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => e.preventDefault()}
    >
      <svg
        width="16"
        height="16"
        className={cc([
          "nk-fill-current",
          clockUrgency,
          isHovered && hoverColor,
        ])}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM9 4C9 3.44772 8.55229 3 8 3C7.44772 3 7 3.44772 7 4V8C7 8.26522 7.10536 8.51957 7.29289 8.70711L10.1213 11.5355C10.5118 11.9261 11.145 11.9261 11.5355 11.5355C11.9261 11.145 11.9261 10.5118 11.5355 10.1213L9 7.58579V4Z"
          style={{ transition: "fill 100ms ease-in-out" }}
        />
      </svg>
    </div>
  );
};
