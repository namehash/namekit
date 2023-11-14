"use client";

import { useSearchStore } from "@namehash/nameguard-react";

export default function NotFound() {
  const { openModal } = useSearchStore();

  return (
    <>
      <div className="w-full h-[calc(100vh-185px)] gt_mobile:h-[calc(100vh-144px)] flex flex-col justify-center items-center px-5 pt-[108px] pb-[85px] gt_mobile:p-0 bg-error404_background bg-[50%_0%] gt_mobile:bg-[50%_30%] bg-no-repeat bg-[length:100%_60%]">
        <div className="z-10 relative w-full h-fit max-w-[500px] inline-flex flex-col items-center justify-center gap-10 md:gap-[60px]">
          <Error404IconSmall />
          <Error404IconLarge />
          <div className="w-full h-full flex flex-col items-center justify-center gap-5">
            <div className="w-fit h-fit flex flex-col items-center justify-center gap-3">
              <h2 className="text-black text-center not-italic text-2xl leading-8 font-semibold md:text-4xl md:leading-10 md:font-bold">
                Page not found
              </h2>
              <p className="text-center text-gray-500 not-italic text-base leading-6 font-normal px-10 gt_mobile:px-5 md:px-0 gt_mobile:font-light gt_mobile:text-sm">
                We can&apos;t seem to find the page you&apos;re looking for
              </p>
            </div>
            <button
              onClick={openModal}
              className="flex justify-center items-center px-[17px] py-[9px] bg-white rounded-lg border border-gray-300 shadow-sm pointer-cursor hover:bg-gray-50 transition-colors"
            >
              <p className="text-black text-base leading-6 font-medium gt_mobile:text-sm gt_mobile:leading-5">
                Inspect any ENS name
              </p>
            </button>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 z-0 h-full w-[100vw] max-w-[100vw] overflow-x-hidden bg-[radial-gradient(#DDDDDD_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>
    </>
  );
}

const Error404IconSmall = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="221"
    height="88"
    viewBox="0 0 221 88"
    fill="none"
    className="block md:hidden flex-shrink-0"
  >
    <g clipPath="url(#clip0_1450_6699)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M117.231 6.64097L112.7 2.36328L108.169 6.64097C101.462 12.9731 92.4191 16.8505 82.45 16.8505C82.2911 16.8505 82.1324 16.8495 81.974 16.8476L77.1389 16.7877L75.6244 21.3799C73.9845 26.352 73.1 31.6586 73.1 37.1581C73.1 60.6956 89.247 80.4361 111.06 86.033L112.7 86.4538L114.34 86.033C136.153 80.4361 152.3 60.6956 152.3 37.1581C152.3 31.6586 151.415 26.352 149.776 21.3799L148.261 16.7877L143.426 16.8476C143.268 16.8495 143.109 16.8505 142.95 16.8505C132.981 16.8505 123.938 12.9731 117.231 6.64097ZM86.3 37.1581C86.3 34.6516 86.5475 32.2077 87.0182 29.8473C96.5942 28.9917 105.408 25.473 112.7 20.0429C119.992 25.473 128.806 28.9917 138.382 29.8473C138.853 32.2077 139.1 34.6516 139.1 37.1581C139.1 53.9054 128.002 68.1033 112.7 72.786C97.3984 68.1033 86.3 53.9054 86.3 37.1581ZM0.294037 70.2163V58.1069L30.6563 10.2731H35.4858H41.0966H49.9034V57.8938H58.9233V70.2163H49.9034V83.0004H35.2017V70.2163H0.294037ZM34.9176 27.0344H35.4858V57.8938H15.777V57.3256L34.9176 27.0344ZM161.98 70.2163V58.1069L192.342 10.2731H197.172H202.783H211.589V57.8938H220.609V70.2163H211.589V83.0004H196.888V70.2163H161.98ZM196.604 27.0344H197.172V57.8938H177.463V57.3256L196.604 27.0344Z"
        fill="url(#paint0_linear_1450_6699)"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_1450_6699"
        x1="110.452"
        y1="2.36328"
        x2="110.452"
        y2="86.4538"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#4F4F4F" />
        <stop offset="1" />
      </linearGradient>
      <clipPath id="clip0_1450_6699">
        <rect width="220" height="88" fill="white" transform="translate(0.5)" />
      </clipPath>
    </defs>
  </svg>
);

const Error404IconLarge = () => (
  <svg
    width="500"
    height="200"
    viewBox="0 0 500 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="hidden md:block flex-shrink-0"
  >
    <g clipPath="url(#clip0_1447_5217)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M-0.468079 132.061V159.582H78.8675V188.637H112.281V159.582H132.78V131.577H112.281V23.3477H92.265H79.5132H68.537L-0.468079 132.061ZM79.5132 61.4417H78.2219L34.7205 130.285V131.577H79.5132V61.4417ZM367 132.061V159.582H446.336V188.637H479.749V159.582H500.248V131.577H479.749V23.3477H459.733H446.981H436.005L367 132.061ZM446.981 61.4417H445.69L402.189 130.285V131.577H446.981V61.4417Z"
        fill="url(#paint0_linear_1447_5217)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M255 5.37109L265.297 15.0931C280.541 29.4844 301.093 38.2966 323.75 38.2966C324.111 38.2966 324.472 38.2944 324.832 38.2899L335.821 38.1539L339.263 48.5906C342.99 59.891 345 71.9513 345 84.4503C345 137.945 308.302 182.809 258.728 195.529L255 196.486L251.272 195.529C201.698 182.809 165 137.945 165 84.4503C165 71.9513 167.01 59.891 170.737 48.5906L174.179 38.1539L185.168 38.2899C185.528 38.2944 185.889 38.2966 186.25 38.2966C208.907 38.2966 229.459 29.4844 244.703 15.0931L255 5.37109ZM196.632 67.8349C195.562 73.1992 195 78.7537 195 84.4503C195 122.512 220.224 154.78 255 165.423C289.776 154.78 315 122.512 315 84.4503C315 78.7537 314.438 73.1992 313.368 67.8349C291.604 65.8903 271.572 57.8932 255 45.5521C238.428 57.8932 218.396 65.8903 196.632 67.8349Z"
        fill="url(#paint1_linear_1447_5217)"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_1447_5217"
        x1="249.89"
        y1="23.3477"
        x2="249.89"
        y2="188.637"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#4F4F4F" />
        <stop offset="1" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_1447_5217"
        x1="255"
        y1="5.37109"
        x2="255"
        y2="196.486"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#4F4F4F" />
        <stop offset="1" />
      </linearGradient>
      <clipPath id="clip0_1447_5217">
        <rect width="500" height="200" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
