import { type SVGProps } from "react";

export const TwitterIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      viewBox="0 0 16 16"
      fill={props.fill ? props.fill : "currentColor"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={props.fill ? props.fill : "currentColor"}
        d="M9.52217 6.77491L15.4785 0H14.0671L8.89516 5.88256L4.76437 0H0L6.24656 8.89547L0 16H1.41155L6.87321 9.78782L11.2356 16H16L9.52183 6.77491H9.52217ZM7.58887 8.97384L6.95596 8.08805L1.92015 1.03974H4.0882L8.15216 6.72795L8.78507 7.61374L14.0677 15.0075H11.8997L7.58887 8.97418V8.97384Z"
      />
    </svg>
  );
};
