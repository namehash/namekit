import React from "react";

export const LoadingSkeleton = () => {
  return (
    <div className="p-6 space-y-8 w-full">
      <div className="rounded-xl border shadow-xl border-gray-200 shadow-gray-100 px-5 pt-7 pb-10 md:py-7 lg:pt-8 lg:pb-10 md:px-[30px] flex flex-col animate-pulse space-y-1">
        <div className="flex items-center space-x-3">
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
          <div className="w-20 h-2 rounded-full bg-gradient-to-br from-gray-200 to-gray-100"></div>
        </div>

        <div className="flex flex-col items-center space-y-10 border-b border-gray-200 pb-10">
          <div className="rounded-full h-[60px] w-[60px] bg-gradient-to-br from-gray-200 to-gray-100"></div>
          <div className="rounded h-3 w-52 bg-gradient-to-br from-gray-200 to-gray-100"></div>
        </div>

        <div className="flex justify-center items-center space-x-10 pt-10">
          <div className="flex flex-col space-y-3">
            <div className="rounded h-2 w-20 bg-gradient-to-br from-gray-200 to-gray-100"></div>
            <div className="rounded h-2 w-14 bg-gradient-to-br from-gray-200 to-gray-100"></div>
          </div>
          <div className="flex flex-col space-y-3">
            <div className="rounded h-2 w-8 bg-gradient-to-br from-gray-200 to-gray-100"></div>
            <div className="rounded h-2 w-16 bg-gradient-to-br from-gray-200 to-gray-100"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
