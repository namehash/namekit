import React from "react";

export const LoadingSkeleton = () => {
  return (
    <div className="ng-p-6 ng-space-y-8 ng-w-full">
      <div className="ng-rounded-xl ng-border ng-shadow-xl ng-border-gray-200 ng-shadow-gray-100 ng-px-5 ng-pt-7 ng-pb-10 md:ng-py-7 lg:ng-pt-8 lg:ng-pb-10 md:ng-px-[30px] ng-flex ng-flex-col ng-animate-pulse ng-space-y-1">
        <div className="ng-flex ng-items-center ng-space-x-3">
          <svg
            width="20"
            height="22"
            viewBox="0 0 20 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.48428 1.1698C9.77353 0.895873 10.2265 0.895873 10.5157 1.1698C12.5325 3.07977 15.2538 4.25011 18.25 4.25011C18.2977 4.25011 18.3453 4.24981 18.3928 4.24922C18.7202 4.24515 19.0123 4.4539 19.1146 4.76491C19.5271 6.01968 19.75 7.35963 19.75 8.75015C19.75 14.6922 15.6859 19.6831 10.1869 21.0984C10.0643 21.13 9.93569 21.13 9.81306 21.0984C4.31406 19.6831 0.25 14.6922 0.25 8.75015C0.25 7.35963 0.472873 6.01968 0.885415 4.76491C0.987669 4.4539 1.27984 4.24515 1.60721 4.24922C1.65473 4.24981 1.70233 4.25011 1.75 4.25011C4.74624 4.25011 7.46752 3.07977 9.48428 1.1698Z"
              fill="url(#paint0_linear_1388_4437)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1388_4437"
                x1="0.25"
                y1="2.01424"
                x2="20.4575"
                y2="2.90111"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#D9DDE6" />
                <stop offset="1" stopColor="#F0F4FB" />
              </linearGradient>
            </defs>
          </svg>
          <div className="ng-w-20 ng-h-2 ng-rounded-full ng-bg-gradient-to-br ng-from-gray-200 ng-to-gray-100"></div>
        </div>

        <div className="ng-flex ng-flex-col ng-items-center ng-space-y-10 ng-border-b ng-border-gray-200 ng-pb-10">
          <div className="ng-rounded-full ng-h-[60px] ng-w-[60px] ng-bg-gradient-to-br ng-from-gray-200 ng-to-gray-100"></div>
          <div className="ng-rounded ng-h-3 ng-w-52 ng-bg-gradient-to-br ng-from-gray-200 ng-to-gray-100"></div>
        </div>

        <div className="ng-flex ng-justify-center ng-items-center ng-space-x-10 ng-pt-10">
          <div className="ng-flex ng-flex-col ng-space-y-3">
            <div className="ng-rounded ng-h-2 ng-w-20 ng-bg-gradient-to-br ng-from-gray-200 ng-to-gray-100"></div>
            <div className="ng-rounded ng-h-2 ng-w-14 ng-bg-gradient-to-br ng-from-gray-200 ng-to-gray-100"></div>
          </div>
          <div className="flex flex-col space-y-3">
            <div className="ng-rounded ng-h-2 ng-w-8 ng-bg-gradient-to-br ng-from-gray-200 ng-to-gray-100"></div>
            <div className="ng-rounded ng-h-2 ng-w-16 ng-bg-gradient-to-br ng-from-gray-200 ng-to-gray-100"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
