import { SVGProps } from "react";

export const HeroTexture = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="569"
      height="1133"
      viewBox="0 0 569 1133"
      shapeRendering="crispEdges"
      fill="none"
      preserveAspectRatio="none"
      {...props}
    >
      <path
        d="M-620 -60L560 -60L560 1130L-620 1130L-620 -60Z"
        fill="url(#paint0_linear_3459_37796)"
        shapeRendering="crispEdges"
      />
      <path
        d="M-624 -60L569 -60L569 1133L-624 1133L-624 -60Z"
        fill="url(#paint1_radial_3459_37796)"
        shapeRendering="crispEdges"
      />
      <defs>
        <linearGradient
          id="paint0_linear_3459_37796"
          x1="-28.4163"
          y1="-60"
          x2="-28.4163"
          y2="1133"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F112D9" />
          <stop offset="0.958333" stopColor="#2ED3C6" />
        </linearGradient>
        <radialGradient
          id="paint1_radial_3459_37796"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(-28.1928 535.807) scale(597.193)"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </radialGradient>
      </defs>
    </svg>
  );
};
