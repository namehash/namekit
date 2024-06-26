export const AirplaneIllustration = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 646 459"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g opacity="0.2">
      <rect
        y="459"
        width="376"
        height="578"
        transform="rotate(-90 0 459)"
        fill="url(#paint0_linear_2283_11507)"
      />
      <rect
        y="459"
        width="376"
        height="578"
        transform="rotate(-90 0 459)"
        fill="url(#paint1_radial_2283_11507)"
      />
    </g>
    <path
      d="M273.5 319C233.5 352.834 141 316.5 164.5 284.5C188 252.5 255 337.5 174 368C61.9347 410.198 34.9207 331.713 66 298C95.5 266 174 334 10 429.5"
      stroke="url(#paint2_linear_2283_11507)"
      stroke-width="2"
      stroke-dasharray="8 8"
    />
    <g filter="url(#filter0_d_2283_11507)">
      <path
        d="M273.5 320.394L265.697 212.893L544.961 100.578L273.5 320.394Z"
        fill="url(#paint3_linear_2283_11507)"
      />
      <path
        d="M319.5 267.499L273.499 320.393L326.884 277.427L319.5 267.499Z"
        fill="#D3DBDE"
      />
      <path
        d="M265.76 213.405L220.225 179.727C214.647 175.601 216.606 166.816 223.409 165.451L545.142 100.891L265.76 213.405Z"
        fill="url(#paint4_linear_2283_11507)"
      />
      <path
        d="M319.569 267.464L379.297 351.581C382.625 356.267 389.661 356.02 392.652 351.112L545.143 100.891L319.569 267.464Z"
        fill="url(#paint5_linear_2283_11507)"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_2283_11507"
        x="116.978"
        y="0.578339"
        width="528.165"
        height="454.371"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="50" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_2283_11507"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_2283_11507"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_2283_11507"
        x1="188"
        y1="598.984"
        x2="188"
        y2="1037"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#FBA600" />
        <stop offset="0.322917" stop-color="#F112D9" />
        <stop offset="0.708333" stop-color="#4C3FA0" />
        <stop offset="0.958333" stop-color="#2ED3C6" />
      </linearGradient>
      <radialGradient
        id="paint1_radial_2283_11507"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(188 748) rotate(90) scale(289 188)"
      >
        <stop stop-color="white" stop-opacity="0" />
        <stop offset="1" stop-color="white" />
      </radialGradient>
      <linearGradient
        id="paint2_linear_2283_11507"
        x1="11"
        y1="426.5"
        x2="276.5"
        y2="317.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#FFAF00" />
        <stop offset="1" stop-color="#F112D9" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_2283_11507"
        x1="455"
        y1="164.5"
        x2="260"
        y2="234"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#EAF2F6" />
        <stop offset="1" stop-color="white" />
      </linearGradient>
      <linearGradient
        id="paint4_linear_2283_11507"
        x1="206"
        y1="175"
        x2="538"
        y2="102"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#EAF2F6" />
        <stop offset="1" stop-color="white" />
      </linearGradient>
      <linearGradient
        id="paint5_linear_2283_11507"
        x1="394"
        y1="343"
        x2="453.5"
        y2="184"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#EAF2F6" />
        <stop offset="1" stop-color="white" />
      </linearGradient>
    </defs>
  </svg>
);
