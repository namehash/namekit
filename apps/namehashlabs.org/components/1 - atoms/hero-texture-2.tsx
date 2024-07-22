import { SVGProps } from "react";

export const HeroTextureRight = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="692"
      height="838"
      viewBox="0 0 692 838"
      shapeRendering="crispEdges"
      fill="none"
      preserveAspectRatio="none"
      {...props}
    >
      <defs>
        <linearGradient
          id="paint0_linear_3459_37794"
          x1="595.584"
          y1="-355"
          x2="595.584"
          y2="838"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            stopColor="#F112D9"
            // style={{ animation: "colorTransition 3s infinite" }}
          />
          <stop
            offset="0.958333"
            stopColor="#2ED3C6"
            // style={{ animation: "colorTransition2 2s infinite" }}
          />
        </linearGradient>
        <radialGradient
          id="paint1_radial_3459_37794"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(595.807 240.807) scale(597.193)"
        >
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="1" />
        </radialGradient>
      </defs>
      <path
        d="M0 -355L1193 -355L1193 838L0 838L0 -355Z"
        fill="url(#paint0_linear_3459_37794)"
        shapeRendering="crispEdges"
      />
      <path
        d="M0 -355L1193 -355L1193 838L0 838L0 -355Z"
        fill="url(#paint1_radial_3459_37794)"
        shapeRendering="crispEdges"
      />
    </svg>
  );
};
