import { NextLink } from "@ui/link";

import { HeroCarousel } from "./HeroCarousel";
import { HeroStartCommand } from "./HeroStartCommand";
import { NGSearch } from "./NGSearch";

export function Hero() {
  return (
    <div className="relative bg-hero_background bg-no-repeat bg-center bg-contain">
      <section className="md:min-h-[800px] xl:min-h-[960px] box-border relative z-10 w-full h-full py-[61px] sm:py-24 px-5 flex flex-col items-center justify-center md:px-10 md:pb-32">
        <div className="inline-flex flex-col items-center gap-5 w-full h-fit relative z-20">
          <div className="flex flex-col gap-2 w-fit h-fit">
            <p className="text-center not-italic uppercase text-gray-500 text-xs tracking-[0.3px] font-medium">
              An open source public good
            </p>
            <h1 className="text-black text-center not-italic font-bold text-4xl leading-10 gt_mobile:text-5xl gt_mobile:leading-[52px]">
              Protect your community <br className="hidden md:block" />
              with NameGuard for ENS
            </h1>
          </div>
          <p className="text-center not-italic font-normal text-gray-500 text-lg leading-7 gt_mobile:text-base gt_mobile:leading-6 gt_mobile:font-light">
            Guard your users from heartbreak and keep ENS usage safe across web3
          </p>
          <HeroStartCommand />
          <div className="max-w-md">
            <div className="flex flex-col items-center gap-3 self-stretch">
              <div className="search_bar_change:hidden">
                <NGSearch />
              </div>
              <p className="w-full h-fit text-gray-500 text-sm leading-6 font-normal text-center gt_mobile:font-light search_bar_change:hidden">
                or
              </p>
              <NextLink href="https://api.nameguard.io/docs">
                View the docs
              </NextLink>
            </div>
          </div>
        </div>

        <div className="absolute z-0 top-0 left-0 h-full w-full box-border bg-center bg-[radial-gradient(#DEDEDEB2_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="box-border flex flex-col items-center justify-center w-full h-full">
          <WarningShieldOrangeOutline className="absolute z-10 hidden lg:block top-[5%] left-[20%]" />
          <WarningShieldOrangeOutline className="absolute z-10 hidden lg:block top-[6%] right-[22%]" />
          <CheckShieldLarge className="absolute z-10 hidden xl:block top-[7%] left-[60%]" />
          <WarningShieldSmall className="absolute z-10 hidden lg:block top-[7%] right-[5%]" />
          <UnknownShieldSmallIcon className="absolute z-10 hidden xl:block top-[11%] left-[42%]" />
          <CheckShieldLarge className="absolute z-10 hidden lg:block top-[12%] left-[7%]" />
          <UnknownShieldLargeIcon className="absolute z-10 hidden lg:block top-[18%] right-[12%]" />
          <WarningShieldSmall className="absolute z-10 hidden xl:block top-[37%] left-[20%]" />
          <WarningShieldRedOutline className="absolute z-10 hidden lg:block top-[45%] right-[5%]" />
          <CheckShieldOutline className="absolute z-10 hidden lg:block top-[50%] left-[6%]" />
          <WarningShieldSmall className="absolute z-10 hidden lg:block bottom-[47%] right-[20%]" />
          <UnknownShieldSmallIcon className="absolute z-10 hidden lg:block bottom-[40%] left-[25%]" />
          <WarningShieldLarge className="absolute z-10 hidden lg:block bottom-[22%] left-[6%]" />
          <CheckShieldLarge className="absolute z-10 hidden xl:block bottom-[25%] right-[30%]" />
          <UnknownShieldSmallIcon className="absolute z-10 hidden xl:block bottom-[19%] left-[43%]" />
          <WarningShieldLarge className="absolute z-10 hidden lg:block bottom-[15%] right-[6%]" />
          <WarningShieldRedOutline className="absolute z-10 hidden lg:block bottom-[15%] left-[30%]" />
          <WarningShieldOrangeOutline className="absolute z-10 hidden lg:block bottom-[12%] right-[41%]" />
        </div>
      </section>

      <div className="max-w-6xl mx-auto py-6 space-y-10">
        <p className="text-center not-italic font-light text-gray-500 text-lg leading-7">
          Identify hidden risks or limitations in an ENS name
        </p>
        <div className="relative overflow-x-hidden w-full h-10 group">
          <div className="z-10 absolute top-0 w-full h-full pointer-events-none shadow-[inset_45px_0_25px_-20px_rgba(249,250,251,0.97),inset_-45px_0_25px_-20px_rgba(249,250,251,0.97)]"></div>
          <HeroCarousel />
        </div>
      </div>
    </div>
  );
}

const WarningShieldOrangeOutline = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M12 9.00009V12.7501M12 2.71436C9.8495 4.75098 6.94563 6.00011 3.75 6.00011C3.69922 6.00011 3.64852 5.99979 3.59789 5.99916C3.2099 7.17927 3 8.4402 3 9.75015C3 15.3417 6.82432 20.04 12 21.3721C17.1757 20.04 21 15.3417 21 9.75015C21 8.4402 20.7901 7.17927 20.4021 5.99916C20.3515 5.99979 20.3008 6.00011 20.25 6.00011C17.0544 6.00011 14.1505 4.75098 12 2.71436ZM12 15.7501H12.0075V15.7576H12V15.7501Z"
      stroke="#F59E0B"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WarningShieldRedOutline = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M12 9.00009V12.7501M12 2.71436C9.8495 4.75098 6.94563 6.00011 3.75 6.00011C3.69922 6.00011 3.64852 5.99979 3.59789 5.99916C3.2099 7.17927 3 8.4402 3 9.75015C3 15.3417 6.82432 20.04 12 21.3721C17.1757 20.04 21 15.3417 21 9.75015C21 8.4402 20.7901 7.17927 20.4021 5.99916C20.3515 5.99979 20.3008 6.00011 20.25 6.00011C17.0544 6.00011 14.1505 4.75098 12 2.71436ZM12 15.7501H12.0075V15.7576H12V15.7501Z"
      stroke="#DC2626"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckShieldOutline = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M9 12.7496L11.25 14.9996L15 9.7496M12 2.71387C9.8495 4.75049 6.94563 5.99962 3.75 5.99962C3.69922 5.99962 3.64852 5.9993 3.59789 5.99867C3.2099 7.17878 3 8.43971 3 9.74966C3 15.3412 6.82432 20.0395 12 21.3716C17.1757 20.0395 21 15.3412 21 9.74966C21 8.43971 20.7901 7.17878 20.4021 5.99867C20.3515 5.9993 20.3008 5.99962 20.25 5.99962C17.0544 5.99962 14.1505 4.75049 12 2.71387Z"
      stroke="#059669"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckShieldLarge = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="98"
    height="98"
    viewBox="0 0 98 98"
    fill="none"
    {...props}
  >
    <g clipPath="url(#clip0_1464_6717)">
      <g filter="url(#filter0_dd_1464_6717)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M50.9027 12.2567C49.8669 11.2758 48.245 11.2758 47.2092 12.2567C39.987 19.0964 30.242 23.2875 19.5122 23.2875C19.3415 23.2875 19.1711 23.2864 19.0008 23.2843C17.8285 23.2698 16.7823 24.0172 16.4161 25.131C14.9387 29.6244 14.1406 34.4229 14.1406 39.4024C14.1406 60.6811 28.6943 78.5539 48.3865 83.6223C48.8256 83.7353 49.2863 83.7353 49.7254 83.6223C69.4176 78.5539 83.9713 60.6811 83.9713 39.4024C83.9713 34.4229 83.1732 29.6244 81.6959 25.131C81.3297 24.0172 80.2834 23.2698 79.1111 23.2843C78.9409 23.2864 78.7704 23.2875 78.5997 23.2875C67.8699 23.2875 58.1249 19.0964 50.9027 12.2567Z"
          fill="#059669"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.0523 19.2557C19.2058 19.2577 19.3595 19.2587 19.5136 19.2587C29.1725 19.2587 37.9366 15.4908 44.4403 9.3315C47.0298 6.87908 51.0848 6.87908 53.6743 9.3315C60.178 15.4908 68.9421 19.2587 78.601 19.2587C78.7551 19.2587 78.9088 19.2577 79.0623 19.2557L79.1124 23.2841C78.9423 23.2863 78.7717 23.2874 78.601 23.2874C67.8713 23.2874 58.1263 19.0963 50.904 12.2566C49.8683 11.2756 48.2463 11.2756 47.2105 12.2566C39.9883 19.0963 30.2433 23.2874 19.5136 23.2874C19.3429 23.2874 19.1725 23.2863 19.0022 23.2841C17.8298 23.2696 16.7836 24.0171 16.4174 25.1309C14.9401 29.6242 14.142 34.4228 14.142 39.4023C14.142 60.681 28.6956 78.5538 48.3879 83.6221C48.827 83.7352 49.2876 83.7352 49.7267 83.6221C69.419 78.5538 83.9726 60.681 83.9726 39.4023C83.9726 34.4228 83.1745 29.6242 81.6972 25.1309C81.331 24.0171 80.2848 23.2696 79.1124 23.2841L79.0623 19.2557C81.9931 19.2193 84.6089 21.0882 85.5243 23.8726C87.1335 28.7671 88.0013 33.99 88.0013 39.4023C88.0013 62.5642 72.1594 82.0084 50.731 87.5237C49.6331 87.8063 48.4815 87.8063 47.3836 87.5237C25.9552 82.0084 10.1133 62.5642 10.1133 39.4023C10.1133 33.99 10.9811 28.7671 12.5903 23.8726C13.5057 21.0882 16.1215 19.2193 19.0523 19.2557ZM46.0288 54.0613L57.6149 37.8406C58.4771 36.6336 60.1545 36.354 61.3616 37.2162C62.5686 38.0784 62.8482 39.7559 61.986 40.9628L48.5571 59.7634C48.0982 60.4058 47.3799 60.8138 46.5931 60.879C45.8063 60.9441 45.0306 60.6597 44.4724 60.1014L36.415 52.044C35.3661 50.9952 35.3661 49.2946 36.415 48.2458C37.4638 47.1968 39.1644 47.1968 40.2132 48.2458L46.0288 54.0613Z"
          fill="white"
        />
        <path
          d="M61.9847 40.963C62.8468 39.756 62.5672 38.0786 61.3603 37.2163C60.1531 36.3541 58.4757 36.6337 57.6136 37.8407L46.0275 54.0614L40.2119 48.2459C39.1631 47.197 37.4625 47.197 36.4137 48.2459C35.3647 49.2947 35.3647 50.9953 36.4137 52.0441L44.471 60.1015C45.0293 60.6598 45.8049 60.9442 46.5917 60.8791C47.3785 60.8139 48.0969 60.406 48.5557 59.7635L61.9847 40.963Z"
          fill="white"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_dd_1464_6717"
        x="3.89508"
        y="5.41945"
        width="90.3251"
        height="92.68"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="2.07273" />
        <feGaussianBlur stdDeviation="2.07273" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1464_6717"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4.14547" />
        <feGaussianBlur stdDeviation="3.1091" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow_1464_6717"
          result="effect2_dropShadow_1464_6717"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect2_dropShadow_1464_6717"
          result="shape"
        />
      </filter>
      <clipPath id="clip0_1464_6717">
        <rect width="98" height="98" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const WarningShieldLarge = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="98"
    height="98"
    viewBox="0 0 98 98"
    fill="none"
    {...props}
  >
    <g clipPath="url(#clip0_1464_6732)">
      <g filter="url(#filter0_dd_1464_6732)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M50.9027 12.2567C49.8669 11.2758 48.245 11.2758 47.2092 12.2567C39.987 19.0964 30.242 23.2875 19.5122 23.2875C19.3415 23.2875 19.1711 23.2864 19.0008 23.2843C17.8285 23.2698 16.7823 24.0172 16.4161 25.131C14.9387 29.6244 14.1406 34.4229 14.1406 39.4024C14.1406 60.6811 28.6943 78.5539 48.3865 83.6223C48.8256 83.7353 49.2863 83.7353 49.7254 83.6223C69.4176 78.5539 83.9713 60.6811 83.9713 39.4024C83.9713 34.4229 83.1732 29.6244 81.6959 25.131C81.3297 24.0172 80.2834 23.2698 79.1111 23.2843C78.9409 23.2864 78.7704 23.2875 78.5997 23.2875C67.8699 23.2875 58.1249 19.0964 50.9027 12.2567Z"
          fill="#F59E0B"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M48.9734 34.2446C50.4592 34.2446 51.6635 35.449 51.6635 36.9348V50.3856C51.6635 51.8713 50.4592 53.0758 48.9734 53.0758C47.4876 53.0758 46.2832 51.8713 46.2832 50.3856V36.9348C46.2832 35.449 47.4876 34.2446 48.9734 34.2446ZM48.9734 58.4561C47.4876 58.4561 46.2832 59.6605 46.2832 61.1463V61.1732C46.2832 62.6589 47.4876 63.8634 48.9734 63.8634H49.0003C50.4861 63.8634 51.6904 62.6589 51.6904 61.1732V61.1463C51.6904 59.6605 50.4861 58.4561 49.0003 58.4561H48.9734Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.0523 19.2557C19.2058 19.2577 19.3595 19.2587 19.5136 19.2587C29.1725 19.2587 37.9366 15.4908 44.4403 9.3315C47.0298 6.87908 51.0848 6.87908 53.6743 9.3315C60.178 15.4908 68.9421 19.2587 78.601 19.2587C78.7551 19.2587 78.9088 19.2577 79.0623 19.2557L79.1124 23.2841C78.9423 23.2863 78.7717 23.2874 78.601 23.2874C67.8713 23.2874 58.1263 19.0963 50.904 12.2566C49.8683 11.2756 48.2463 11.2756 47.2105 12.2566C39.9883 19.0963 30.2433 23.2874 19.5136 23.2874C19.3429 23.2874 19.1725 23.2863 19.0022 23.2841C17.8298 23.2696 16.7836 24.0171 16.4174 25.1309C14.9401 29.6242 14.142 34.4228 14.142 39.4023C14.142 60.681 28.6956 78.5538 48.3879 83.6221C48.827 83.7352 49.2876 83.7352 49.7267 83.6221C69.419 78.5538 83.9726 60.681 83.9726 39.4023C83.9726 34.4228 83.1745 29.6242 81.6972 25.1309C81.331 24.0171 80.2848 23.2696 79.1124 23.2841L79.0623 19.2557C81.9931 19.2193 84.6089 21.0882 85.5243 23.8726C87.1335 28.7671 88.0013 33.99 88.0013 39.4023C88.0013 62.5642 72.1594 82.0084 50.731 87.5237C49.6331 87.8063 48.4815 87.8063 47.3836 87.5237C25.9552 82.0084 10.1133 62.5642 10.1133 39.4023C10.1133 33.99 10.9811 28.7671 12.5903 23.8726C13.5057 21.0882 16.1215 19.2193 19.0523 19.2557Z"
          fill="white"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_dd_1464_6732"
        x="3.89508"
        y="5.41945"
        width="90.3251"
        height="92.68"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="2.07273" />
        <feGaussianBlur stdDeviation="2.07273" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1464_6732"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4.14547" />
        <feGaussianBlur stdDeviation="3.1091" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow_1464_6732"
          result="effect2_dropShadow_1464_6732"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect2_dropShadow_1464_6732"
          result="shape"
        />
      </filter>
      <clipPath id="clip0_1464_6732">
        <rect width="98" height="98" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const UnknownShieldLargeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="98"
    height="98"
    viewBox="0 0 98 98"
    fill="none"
    {...props}
  >
    <g clipPath="url(#clip0_1464_6794)">
      <g filter="url(#filter0_dd_1464_6794)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M50.9008 12.2567C49.865 11.2758 48.243 11.2758 47.2073 12.2567C39.985 19.0964 30.24 23.2875 19.5103 23.2875C19.3396 23.2875 19.1692 23.2864 18.9989 23.2843C17.8265 23.2698 16.7803 24.0172 16.4141 25.131C14.9368 29.6244 14.1387 34.4229 14.1387 39.4024C14.1387 60.6811 28.6923 78.5539 48.3846 83.6223C48.8237 83.7353 49.2843 83.7353 49.7234 83.6223C69.4157 78.5539 83.9693 60.6811 83.9693 39.4024C83.9693 34.4229 83.1712 29.6244 81.6939 25.131C81.3277 24.0172 80.2815 23.2698 79.1091 23.2843C78.939 23.2864 78.7684 23.2875 78.5977 23.2875C67.868 23.2875 58.123 19.0964 50.9008 12.2567Z"
          fill="#DC2626"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M42.6365 37.4592C41.6902 36.513 40.156 36.513 39.2097 37.4592C38.2634 38.4054 38.2634 39.9397 39.2097 40.8859L45.5732 47.2495L39.2097 53.613C38.2634 54.5593 38.2634 56.0935 39.2097 57.0399C40.156 57.9861 41.6902 57.9861 42.6365 57.0399L49 50.6762L55.3635 57.0399C56.3098 57.9861 57.844 57.9861 58.7903 57.0399C59.7366 56.0935 59.7366 54.5593 58.7903 53.613L52.4267 47.2495L58.7903 40.8859C59.7366 39.9397 59.7366 38.4054 58.7903 37.4592C57.844 36.513 56.3098 36.513 55.3635 37.4592L49 43.8228L42.6365 37.4592Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.0523 19.2552C19.2058 19.2572 19.3595 19.2582 19.5136 19.2582C29.1725 19.2582 37.9366 15.4903 44.4403 9.33101C47.0298 6.8786 51.0848 6.8786 53.6743 9.33101C60.178 15.4903 68.9421 19.2582 78.601 19.2582C78.7551 19.2582 78.9088 19.2572 79.0623 19.2552L79.1124 23.2837C78.9423 23.2858 78.7717 23.2869 78.601 23.2869C67.8713 23.2869 58.1263 19.0958 50.904 12.2561C49.8683 11.2751 48.2463 11.2751 47.2105 12.2561C39.9883 19.0958 30.2433 23.2869 19.5136 23.2869C19.3429 23.2869 19.1725 23.2858 19.0022 23.2837C17.8298 23.2692 16.7836 24.0166 16.4174 25.1304C14.9401 29.6237 14.142 34.4223 14.142 39.4018C14.142 60.6805 28.6956 78.5533 48.3879 83.6216C48.827 83.7347 49.2876 83.7347 49.7267 83.6216C69.419 78.5533 83.9726 60.6805 83.9726 39.4018C83.9726 34.4223 83.1745 29.6237 81.6972 25.1304C81.331 24.0166 80.2848 23.2692 79.1124 23.2837L79.0623 19.2552C81.9931 19.2188 84.6089 21.0878 85.5243 23.8721C87.1335 28.7666 88.0013 33.9895 88.0013 39.4018C88.0013 62.5637 72.1594 82.0079 50.731 87.5232C49.6331 87.8058 48.4815 87.8058 47.3836 87.5232C25.9552 82.0079 10.1133 62.5637 10.1133 39.4018C10.1133 33.9895 10.9811 28.7666 12.5903 23.8721C13.5057 21.0878 16.1215 19.2188 19.0523 19.2552Z"
          fill="white"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_dd_1464_6794"
        x="3.89508"
        y="5.41897"
        width="90.3251"
        height="92.68"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="2.07273" />
        <feGaussianBlur stdDeviation="2.07273" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1464_6794"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4.14546" />
        <feGaussianBlur stdDeviation="3.1091" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow_1464_6794"
          result="effect2_dropShadow_1464_6794"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect2_dropShadow_1464_6794"
          result="shape"
        />
      </filter>
      <clipPath id="clip0_1464_6794">
        <rect width="98" height="98" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const WarningShieldSmall = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="56"
    height="56"
    viewBox="0 0 56 56"
    fill="none"
    {...props}
  >
    <g clipPath="url(#clip0_1464_6765)">
      <g filter="url(#filter0_dd_1464_6765)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M29.087 7.00391C28.4951 6.44336 27.5683 6.44336 26.9764 7.00391C22.8494 10.9123 17.2808 13.3072 11.1496 13.3072C11.052 13.3072 10.9546 13.3066 10.8573 13.3054C10.1874 13.2971 9.58959 13.7242 9.38034 14.3607C8.53615 16.9283 8.08008 19.6703 8.08008 22.5157C8.08008 34.675 16.3964 44.888 27.6492 47.7842C27.9001 47.8488 28.1633 47.8488 28.4142 47.7842C39.6669 44.888 47.9833 34.675 47.9833 22.5157C47.9833 19.6703 47.5273 16.9283 46.6831 14.3607C46.4738 13.7242 45.876 13.2971 45.206 13.3054C45.1088 13.3066 45.0114 13.3072 44.9138 13.3072C38.7825 13.3072 33.214 10.9123 29.087 7.00391Z"
          fill="#F59E0B"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M27.9845 19.5684C28.8335 19.5684 29.5217 20.2566 29.5217 21.1056V28.7918C29.5217 29.6407 28.8335 30.329 27.9845 30.329C27.1355 30.329 26.4473 29.6407 26.4473 28.7918V21.1056C26.4473 20.2566 27.1355 19.5684 27.9845 19.5684ZM27.9845 33.4035C27.1355 33.4035 26.4473 34.0917 26.4473 34.9408V34.9561C26.4473 35.8051 27.1355 36.4934 27.9845 36.4934H27.9999C28.8489 36.4934 29.5371 35.8051 29.5371 34.9561V34.9408C29.5371 34.0917 28.8489 33.4035 27.9999 33.4035H27.9845Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.8873 11.0033C10.975 11.0044 11.0629 11.005 11.1509 11.005C16.6703 11.005 21.6784 8.85186 25.3947 5.33228C26.8744 3.93091 29.1916 3.93091 30.6713 5.33228C34.3877 8.85186 39.3958 11.005 44.9152 11.005C45.0032 11.005 45.091 11.0044 45.1787 11.0033L45.2074 13.3052C45.1101 13.3065 45.0127 13.3071 44.9152 13.3071C38.7839 13.3071 33.2153 10.9122 29.0883 7.00377C28.4964 6.44322 27.5696 6.44322 26.9777 7.00377C22.8507 10.9122 17.2822 13.3071 11.1509 13.3071C11.0534 13.3071 10.956 13.3065 10.8587 13.3052C10.1888 13.2969 9.59091 13.7241 9.38167 14.3605C8.53748 16.9281 8.08141 19.6702 8.08141 22.5156C8.08141 34.6749 16.3978 44.8879 27.6505 47.7841C27.9014 47.8487 28.1646 47.8487 28.4156 47.7841C39.6683 44.8879 47.9846 34.6749 47.9846 22.5156C47.9846 19.6702 47.5286 16.9281 46.6844 14.3605C46.4751 13.7241 45.8773 13.2969 45.2074 13.3052L45.1787 11.0033C46.8535 10.9825 48.3482 12.0504 48.8713 13.6415C49.7909 16.4383 50.2867 19.4229 50.2867 22.5156C50.2867 35.7509 41.2342 46.8619 28.9894 50.0135C28.3621 50.175 27.704 50.175 27.0766 50.0135C14.8318 46.8619 5.7793 35.7509 5.7793 22.5156C5.7793 19.4229 6.27519 16.4383 7.19473 13.6415C7.71784 12.0504 9.21255 10.9825 10.8873 11.0033Z"
          fill="white"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_dd_1464_6765"
        x="2.22604"
        y="3.09683"
        width="51.6143"
        height="52.96"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="1.18442" />
        <feGaussianBlur stdDeviation="1.18442" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1464_6765"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="2.36884" />
        <feGaussianBlur stdDeviation="1.77663" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow_1464_6765"
          result="effect2_dropShadow_1464_6765"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect2_dropShadow_1464_6765"
          result="shape"
        />
      </filter>
      <clipPath id="clip0_1464_6765">
        <rect width="56" height="56" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const UnknownShieldSmallIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="56"
    height="56"
    viewBox="0 0 56 56"
    fill="none"
    {...props}
  >
    <g clipPath="url(#clip0_1464_6782)">
      <g filter="url(#filter0_dd_1464_6782)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M29.087 7.00391C28.4951 6.44336 27.5683 6.44336 26.9764 7.00391C22.8494 10.9123 17.2808 13.3072 11.1496 13.3072C11.052 13.3072 10.9546 13.3066 10.8573 13.3054C10.1874 13.2971 9.58959 13.7242 9.38034 14.3607C8.53615 16.9283 8.08008 19.6703 8.08008 22.5157C8.08008 34.675 16.3964 44.888 27.6492 47.7842C27.9001 47.8488 28.1633 47.8488 28.4142 47.7842C39.6669 44.888 47.9833 34.675 47.9833 22.5157C47.9833 19.6703 47.5273 16.9283 46.6831 14.3607C46.4738 13.7242 45.876 13.2971 45.206 13.3054C45.1088 13.3066 45.0114 13.3072 44.9138 13.3072C38.7825 13.3072 33.214 10.9123 29.087 7.00391Z"
          fill="#DC2626"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24.3637 21.4055C23.823 20.8648 22.9463 20.8648 22.4056 21.4055C21.8648 21.9462 21.8648 22.823 22.4056 23.3636L26.0418 27L22.4056 30.6363C21.8648 31.177 21.8648 32.0537 22.4056 32.5945C22.9463 33.1352 23.823 33.1352 24.3637 32.5945L28 28.9581L31.6363 32.5945C32.1771 33.1352 33.0537 33.1352 33.5945 32.5945C34.1352 32.0537 34.1352 31.177 33.5945 30.6363L29.9581 27L33.5945 23.3636C34.1352 22.823 34.1352 21.9462 33.5945 21.4055C33.0537 20.8648 32.1771 20.8648 31.6363 21.4055L28 25.0419L24.3637 21.4055Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.8873 11.0033C10.975 11.0044 11.0629 11.005 11.1509 11.005C16.6703 11.005 21.6784 8.85186 25.3947 5.33228C26.8744 3.93091 29.1916 3.93091 30.6713 5.33228C34.3877 8.85186 39.3958 11.005 44.9152 11.005C45.0032 11.005 45.091 11.0044 45.1787 11.0033L45.2074 13.3052C45.1101 13.3065 45.0127 13.3071 44.9152 13.3071C38.7839 13.3071 33.2153 10.9122 29.0883 7.00377C28.4964 6.44322 27.5696 6.44322 26.9777 7.00377C22.8507 10.9122 17.2822 13.3071 11.1509 13.3071C11.0534 13.3071 10.956 13.3065 10.8587 13.3052C10.1888 13.2969 9.59091 13.7241 9.38167 14.3605C8.53748 16.9281 8.08141 19.6702 8.08141 22.5156C8.08141 34.6749 16.3978 44.8879 27.6505 47.7841C27.9014 47.8487 28.1646 47.8487 28.4156 47.7841C39.6683 44.8879 47.9846 34.6749 47.9846 22.5156C47.9846 19.6702 47.5286 16.9281 46.6844 14.3605C46.4751 13.7241 45.8773 13.2969 45.2074 13.3052L45.1787 11.0033C46.8535 10.9825 48.3482 12.0504 48.8713 13.6415C49.7909 16.4383 50.2867 19.4229 50.2867 22.5156C50.2867 35.7509 41.2342 46.8619 28.9894 50.0135C28.3621 50.175 27.704 50.175 27.0766 50.0135C14.8318 46.8619 5.7793 35.7509 5.7793 22.5156C5.7793 19.4229 6.27519 16.4383 7.19473 13.6415C7.71784 12.0504 9.21255 10.9825 10.8873 11.0033Z"
          fill="white"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_dd_1464_6782"
        x="2.22604"
        y="3.09683"
        width="51.6143"
        height="52.96"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="1.18442" />
        <feGaussianBlur stdDeviation="1.18442" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1464_6782"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="2.36884" />
        <feGaussianBlur stdDeviation="1.77663" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow_1464_6782"
          result="effect2_dropShadow_1464_6782"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect2_dropShadow_1464_6782"
          result="shape"
        />
      </filter>
      <clipPath id="clip0_1464_6782">
        <rect width="56" height="56" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
