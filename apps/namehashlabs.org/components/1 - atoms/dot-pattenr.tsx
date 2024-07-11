import { SVGProps } from "react";

export const DotPattern = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <pattern
          id="dot-pattern"
          x="0"
          y="0"
          width="20" // distance between dots on the x-axis
          height="20" // distance between dots on the y-axis
          patternUnits="userSpaceOnUse"
        >
          <circle cx="0.1" cy="0.1" r="3" fill="black" className="opacity-5" />
          {/* defines the dot itself */}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-pattern)" />
    </svg>
  );
};
