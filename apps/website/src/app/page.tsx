import React from "react";
import { nameguard, CheckResultCode, Rating } from "@namehash/nameguard";
import cc from "classcat";

function Status({ status }: { status: CheckResultCode }) {
  switch (status) {
    case "pass":
      return (
        <svg
          className="w-5 h-5 fill-current text-[#10B981]"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM13.8566 8.19113C14.1002 7.85614 14.0261 7.38708 13.6911 7.14345C13.3561 6.89982 12.8871 6.97388 12.6434 7.30887L9.15969 12.099L7.28033 10.2197C6.98744 9.92678 6.51256 9.92678 6.21967 10.2197C5.92678 10.5126 5.92678 10.9874 6.21967 11.2803L8.71967 13.7803C8.87477 13.9354 9.08999 14.0149 9.30867 13.9977C9.52734 13.9805 9.72754 13.8685 9.85655 13.6911L13.8566 8.19113Z"
          />
        </svg>
      );
    case "alert":
      return (
        <svg
          className="w-5 h-5 fill-current text-[#F59E0B]"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.4845 2.49499C9.15808 1.32833 10.842 1.32833 11.5156 2.495L17.7943 13.37C18.4678 14.5367 17.6259 15.995 16.2787 15.995H3.72136C2.37421 15.995 1.53224 14.5367 2.20582 13.37L8.4845 2.49499ZM10 5C10.4142 5 10.75 5.33579 10.75 5.75V9.25C10.75 9.66421 10.4142 10 10 10C9.58579 10 9.25 9.66421 9.25 9.25L9.25 5.75C9.25 5.33579 9.58579 5 10 5ZM10 14C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12C9.44772 12 9 12.4477 9 13C9 13.5523 9.44772 14 10 14Z"
          />
        </svg>
      );
    case "warn":
      return (
        <svg
          className="w-5 h-5 fill-current text-[#DC2626]"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.4845 2.49499C9.15808 1.32833 10.842 1.32833 11.5156 2.495L17.7943 13.37C18.4678 14.5367 17.6259 15.995 16.2787 15.995H3.72136C2.37421 15.995 1.53224 14.5367 2.20582 13.37L8.4845 2.49499ZM10 5C10.4142 5 10.75 5.33579 10.75 5.75V9.25C10.75 9.66421 10.4142 10 10 10C9.58579 10 9.25 9.66421 9.25 9.25L9.25 5.75C9.25 5.33579 9.58579 5 10 5ZM10 14C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12C9.44772 12 9 12.4477 9 13C9 13.5523 9.44772 14 10 14Z"
          />
        </svg>
      );
    case "skip":
      return (
        <svg
          className="w-[12px] h-[10px] fill-current text-gray-500"
          viewBox="0 0 12 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0.23017 8.70938C-0.0684091 8.99647 -0.0777185 9.47125 0.209377 9.76983C0.496472 10.0684 0.971254 10.0777 1.26983 9.79063L5.76983 5.54062C5.91689 5.39922 6 5.20401 6 5C6 4.79599 5.91689 4.60078 5.76983 4.45938L1.26983 0.209376C0.971253 -0.077719 0.496471 -0.0684092 0.209376 0.230169C-0.0777189 0.528748 -0.0684095 1.00353 0.230169 1.29063L4.16792 5L0.23017 8.70938Z" />
          <path d="M6.23017 8.70938C5.93159 8.99647 5.92228 9.47125 6.20938 9.76983C6.49647 10.0684 6.97125 10.0777 7.26983 9.79063L11.7698 5.54062C11.9169 5.39922 12 5.20401 12 5C12 4.79599 11.9169 4.60078 11.7698 4.45938L7.26983 0.209376C6.97125 -0.077719 6.49647 -0.0684092 6.20938 0.230169C5.92228 0.528748 5.93159 1.00353 6.23017 1.29063L10.1679 5L6.23017 8.70938Z" />
        </svg>
      );
    case "info":
      return (
        <svg
          className="w-5 h-5 fill-current text-gray-400"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM11 6C11 6.55228 10.5523 7 10 7C9.44771 7 9 6.55228 9 6C9 5.44772 9.44771 5 10 5C10.5523 5 11 5.44772 11 6ZM9 9C8.58579 9 8.25 9.33579 8.25 9.75C8.25 10.1642 8.58579 10.5 9 10.5H9.25338C9.41332 10.5 9.53213 10.6481 9.49743 10.8042L9.03829 12.8704C8.79542 13.9633 9.62706 15 10.7466 15H11C11.4142 15 11.75 14.6642 11.75 14.25C11.75 13.8358 11.4142 13.5 11 13.5H10.7466C10.5867 13.5 10.4679 13.3519 10.5026 13.1958L10.9617 11.1296C11.2046 10.0367 10.3729 9 9.25338 9H9Z"
          />
        </svg>
      );
  }
}

function borderColor(rating: Rating) {
  switch (rating) {
    case "alert": {
      return "border-yellow-200";
    }
    case "pass": {
      return "border-green-200";
    }
    case "warn": {
      return "border-red-200";
    }
    default: {
      return "border-gray-200";
    }
  }
}

function shadowColor(rating: Rating) {
  switch (rating) {
    case "alert": {
      return "shadow-yellow-50";
    }
    case "pass": {
      return "shadow-green-50";
    }
    case "warn": {
      return "shadow-red-50";
    }
    default: {
      return "shadow-gray-50";
    }
  }
}

function Summary({
  name,
  rating,
  highest_risk,
}: {
  name: string;
  rating: Rating;
  highest_risk: any;
}) {
  const border = borderColor(rating);
  const shadow = shadowColor(rating);

  const wrapperClass = cc([
    "rounded-xl border shadow-2xl p-5 md:py-[30px] md:px-10 flex flex-col md:flex-row md:items-center justify-between divide-y divide-gray-200 md:divide-y-0 space-y-4 md:space-y-0",
    border,
    shadow,
  ]);

  return (
    <div className={wrapperClass}>
      <div>
        <p className="uppercase text-sm text-gray-500 font-medium">
          Rating for
        </p>
        <h1 className="text-2xl md:text-4xl text-black font-semibold md:font-bold">
          {name}
        </h1>
      </div>
      <div className="flex items-center space-x-4 pt-5 md:pt-0">
        <div>
          <svg
            width="68"
            height="71"
            viewBox="0 0 68 71"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_dd_379_1508)">
              <path
                d="M30.6841 37.977C30.9959 38.2888 31.4291 38.4476 31.8685 38.4113C32.3079 38.3749 32.7091 38.147 32.9654 37.7882L41.5931 25.7094C41.7536 25.4847 42.0659 25.4326 42.2906 25.5931C42.5153 25.7536 42.5674 26.0659 42.4069 26.2906L43.6275 27.1625L42.4069 26.2906L32.4069 40.2906C32.3214 40.4102 32.1877 40.4862 32.0412 40.4983C31.8948 40.5104 31.7504 40.4575 31.6464 40.3536L25.6464 34.3536C25.4512 34.1583 25.4512 33.8417 25.6464 33.6464C25.8417 33.4512 26.1583 33.4512 26.3536 33.6464L30.6841 37.977ZM36.4067 4.69704C35.0569 3.41869 32.9431 3.41869 31.5933 4.69704C26.4828 9.53694 19.5913 12.5003 12 12.5003C11.8791 12.5003 11.7584 12.4995 11.6379 12.498C10.1101 12.4791 8.74667 13.4532 8.26948 14.9046C7.12028 18.3999 6.5 22.1312 6.5 26.0004C6.5 42.547 17.8171 56.4412 33.1276 60.3818C33.6999 60.5291 34.3001 60.5291 34.8724 60.3818C50.1829 56.4412 61.5 42.547 61.5 26.0004C61.5 22.1312 60.8797 18.3999 59.7305 14.9046C59.2533 13.4532 57.8899 12.4791 56.3622 12.498C56.2416 12.4995 56.1209 12.5003 56 12.5003C48.4087 12.5003 41.5172 9.53694 36.4067 4.69704Z"
                fill="#059669"
                stroke="white"
                stroke-width="3"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <filter
                id="filter0_dd_379_1508"
                x="-3"
                y="-1"
                width="74"
                height="74"
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
                <feMorphology
                  radius="1"
                  operator="erode"
                  in="SourceAlpha"
                  result="effect1_dropShadow_379_1508"
                />
                <feOffset dy="2" />
                <feGaussianBlur stdDeviation="2" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_379_1508"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feMorphology
                  radius="1"
                  operator="erode"
                  in="SourceAlpha"
                  result="effect2_dropShadow_379_1508"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="3" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                />
                <feBlend
                  mode="normal"
                  in2="effect1_dropShadow_379_1508"
                  result="effect2_dropShadow_379_1508"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect2_dropShadow_379_1508"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-green-700 text-sm md:text-2xl">
            {highest_risk?.check}
          </p>
          <p className="text-black text-sm font-normal leading-6">
            {highest_risk?.message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  const data = await nameguard.inspectName("vĩtal1k⚡️.eth");

  const { name, highest_risk, rating, risk_count, checks, labels } = data;

  return (
    <>
      <div className="max-w-6xl mx-auto py-32 space-y-12 px-6">
        <div className="space-y-2 md:w-1/2 md:pr-4">
          <h2 className="text-black text-2xl font-semibold">
            NameGuard Report
          </h2>
          <p className="text-gray-500 text-sm leading-6 font-normal">
            NameGuard protects you from being tricked by names that look
            confusingly similar and helps to identify any risks or limitations a
            name might have.
          </p>
        </div>

        <Summary name={name} rating={rating} highest_risk={highest_risk} />

        {/* <div className="rounded-xl border border-green-200 shadow-2xl shadow-green-50 p-5 md:py-[30px] md:px-10 flex flex-col md:flex-row md:items-center justify-between divide-y divide-gray-200 md:divide-y-0 space-y-4 md:space-y-0">
          <div>
            <p className="uppercase text-sm text-gray-500 font-medium">
              Rating for
            </p>
            <h1 className="text-2xl md:text-4xl text-black font-semibold md:font-bold">
              {name}
            </h1>
          </div>
          <div className="flex items-center space-x-4 pt-5 md:pt-0">
            <div>
              <svg
                width="68"
                height="71"
                viewBox="0 0 68 71"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_dd_379_1508)">
                  <path
                    d="M30.6841 37.977C30.9959 38.2888 31.4291 38.4476 31.8685 38.4113C32.3079 38.3749 32.7091 38.147 32.9654 37.7882L41.5931 25.7094C41.7536 25.4847 42.0659 25.4326 42.2906 25.5931C42.5153 25.7536 42.5674 26.0659 42.4069 26.2906L43.6275 27.1625L42.4069 26.2906L32.4069 40.2906C32.3214 40.4102 32.1877 40.4862 32.0412 40.4983C31.8948 40.5104 31.7504 40.4575 31.6464 40.3536L25.6464 34.3536C25.4512 34.1583 25.4512 33.8417 25.6464 33.6464C25.8417 33.4512 26.1583 33.4512 26.3536 33.6464L30.6841 37.977ZM36.4067 4.69704C35.0569 3.41869 32.9431 3.41869 31.5933 4.69704C26.4828 9.53694 19.5913 12.5003 12 12.5003C11.8791 12.5003 11.7584 12.4995 11.6379 12.498C10.1101 12.4791 8.74667 13.4532 8.26948 14.9046C7.12028 18.3999 6.5 22.1312 6.5 26.0004C6.5 42.547 17.8171 56.4412 33.1276 60.3818C33.6999 60.5291 34.3001 60.5291 34.8724 60.3818C50.1829 56.4412 61.5 42.547 61.5 26.0004C61.5 22.1312 60.8797 18.3999 59.7305 14.9046C59.2533 13.4532 57.8899 12.4791 56.3622 12.498C56.2416 12.4995 56.1209 12.5003 56 12.5003C48.4087 12.5003 41.5172 9.53694 36.4067 4.69704Z"
                    fill="#059669"
                    stroke="white"
                    stroke-width="3"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_dd_379_1508"
                    x="-3"
                    y="-1"
                    width="74"
                    height="74"
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
                    <feMorphology
                      radius="1"
                      operator="erode"
                      in="SourceAlpha"
                      result="effect1_dropShadow_379_1508"
                    />
                    <feOffset dy="2" />
                    <feGaussianBlur stdDeviation="2" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_379_1508"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feMorphology
                      radius="1"
                      operator="erode"
                      in="SourceAlpha"
                      result="effect2_dropShadow_379_1508"
                    />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="3" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="effect1_dropShadow_379_1508"
                      result="effect2_dropShadow_379_1508"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect2_dropShadow_379_1508"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-green-700 text-sm md:text-2xl">
                Looks Good
              </p>
              <p className="text-black text-sm font-normal leading-6">
                All security checks passed!
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-yellow-200 shadow-2xl shadow-yellow-50 p-5 md:py-[30px] md:px-10 flex flex-col md:flex-row md:items-center justify-between divide-y divide-gray-200 md:divide-y-0 space-y-4 md:space-y-0">
          <div>
            <p className="uppercase text-sm text-gray-500 font-medium">
              Rating for
            </p>
            <h1 className="text-2xl md:text-4xl text-black font-semibold md:font-bold">
              comic.eth
            </h1>
          </div>
          <div className="flex items-center space-x-4 pt-5 md:pt-0">
            <div>
              <svg
                width="68"
                height="71"
                viewBox="0 0 68 71"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_dd_362_1265)">
                  <path
                    d="M36.4067 4.69704C35.0569 3.41869 32.9431 3.41869 31.5933 4.69704C26.4828 9.53694 19.5913 12.5003 12 12.5003C11.8791 12.5003 11.7584 12.4995 11.6379 12.498C10.1101 12.4791 8.74667 13.4532 8.26948 14.9046C7.12028 18.3999 6.5 22.1312 6.5 26.0004C6.5 42.547 17.8171 56.4412 33.1276 60.3818C33.6999 60.5291 34.3001 60.5291 34.8724 60.3818C50.1829 56.4412 61.5 42.547 61.5 26.0004C61.5 22.1312 60.8797 18.3999 59.7305 14.9046C59.2533 13.4532 57.8899 12.4791 56.3622 12.498C56.2416 12.4995 56.1209 12.5003 56 12.5003C48.4087 12.5003 41.5172 9.53694 36.4067 4.69704ZM34 23.5002C34.2761 23.5002 34.5 23.7241 34.5 24.0002V34.0002C34.5 34.2764 34.2761 34.5002 34 34.5002C33.7239 34.5002 33.5 34.2764 33.5 34.0002V24.0002C33.5 23.7241 33.7239 23.5002 34 23.5002ZM33.5 42.0002C33.5 41.7241 33.7239 41.5002 34 41.5002H34.02C34.2961 41.5002 34.52 41.7241 34.52 42.0002V42.0202C34.52 42.2964 34.2961 42.5202 34.02 42.5202H34C33.7239 42.5202 33.5 42.2964 33.5 42.0202V42.0002Z"
                    fill="#F59E0B"
                    stroke="white"
                    stroke-width="3"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_dd_362_1265"
                    x="-3"
                    y="-1"
                    width="74"
                    height="74"
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
                    <feMorphology
                      radius="1"
                      operator="erode"
                      in="SourceAlpha"
                      result="effect1_dropShadow_362_1265"
                    />
                    <feOffset dy="2" />
                    <feGaussianBlur stdDeviation="2" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_362_1265"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feMorphology
                      radius="1"
                      operator="erode"
                      in="SourceAlpha"
                      result="effect2_dropShadow_362_1265"
                    />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="3" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="effect1_dropShadow_362_1265"
                      result="effect2_dropShadow_362_1265"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect2_dropShadow_362_1265"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-yellow-600 text-sm md:text-2xl">
                Some Risk
              </p>
              <p className="text-black text-sm font-normal leading-6">
                Review any risks before proceeding
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-red-200 shadow-2xl shadow-red-50 p-5 md:py-[30px] md:px-10 flex flex-col md:flex-row md:items-center justify-between divide-y divide-gray-200 md:divide-y-0 space-y-4 md:space-y-0">
          <div>
            <p className="uppercase text-sm text-gray-500 font-medium">
              Rating for
            </p>
            <h1 className="text-2xl md:text-4xl text-black font-semibold md:font-bold">
              zeus.eth
            </h1>
          </div>
          <div className="flex items-center space-x-4 pt-5 md:pt-0">
            <div>
              <svg
                width="68"
                height="71"
                viewBox="0 0 68 71"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_dd_362_2721)">
                  <mask
                    id="path-1-outside-1_362_2721"
                    maskUnits="userSpaceOnUse"
                    x="5"
                    y="2.23804"
                    width="58"
                    height="60"
                    fill="black"
                  >
                    <rect
                      fill="white"
                      x="5"
                      y="2.23804"
                      width="58"
                      height="60"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M35.3752 5.7859C34.6039 5.05542 33.3961 5.05542 32.6248 5.7859C27.2467 10.8791 19.99 14 12 14C11.8729 14 11.746 13.9992 11.6192 13.9977C10.7462 13.9868 9.96712 14.5435 9.69444 15.3729C8.59433 18.7189 8 22.2921 8 26.0002C8 41.8455 18.8375 55.1546 33.5015 58.9289C33.8285 59.0131 34.1715 59.0131 34.4985 58.9289C49.1625 55.1546 60 41.8455 60 26.0002C60 22.2921 59.4057 18.7189 58.3056 15.3729C58.0329 14.5435 57.2538 13.9868 56.3808 13.9977C56.2541 13.9992 56.1271 14 56 14C48.01 14 40.7533 10.8791 35.3752 5.7859ZM25.9191 23.9191C26.7002 23.1381 27.9665 23.1381 28.7475 23.9191L34 29.1716L39.2525 23.9191C40.0335 23.1381 41.2998 23.1381 42.0809 23.9191C42.8619 24.7002 42.8619 25.9665 42.0809 26.7475L36.8284 32L42.0809 37.2525C42.8619 38.0335 42.8619 39.2998 42.0809 40.0809C41.2998 40.8619 40.0335 40.8619 39.2525 40.0809L34 34.8284L28.7475 40.0809C27.9665 40.8619 26.7002 40.8619 25.9191 40.0809C25.1381 39.2998 25.1381 38.0335 25.9191 37.2525L31.1716 32L25.9191 26.7475C25.1381 25.9665 25.1381 24.7002 25.9191 23.9191Z"
                    />
                  </mask>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M35.3752 5.7859C34.6039 5.05542 33.3961 5.05542 32.6248 5.7859C27.2467 10.8791 19.99 14 12 14C11.8729 14 11.746 13.9992 11.6192 13.9977C10.7462 13.9868 9.96712 14.5435 9.69444 15.3729C8.59433 18.7189 8 22.2921 8 26.0002C8 41.8455 18.8375 55.1546 33.5015 58.9289C33.8285 59.0131 34.1715 59.0131 34.4985 58.9289C49.1625 55.1546 60 41.8455 60 26.0002C60 22.2921 59.4057 18.7189 58.3056 15.3729C58.0329 14.5435 57.2538 13.9868 56.3808 13.9977C56.2541 13.9992 56.1271 14 56 14C48.01 14 40.7533 10.8791 35.3752 5.7859ZM25.9191 23.9191C26.7002 23.1381 27.9665 23.1381 28.7475 23.9191L34 29.1716L39.2525 23.9191C40.0335 23.1381 41.2998 23.1381 42.0809 23.9191C42.8619 24.7002 42.8619 25.9665 42.0809 26.7475L36.8284 32L42.0809 37.2525C42.8619 38.0335 42.8619 39.2998 42.0809 40.0809C41.2998 40.8619 40.0335 40.8619 39.2525 40.0809L34 34.8284L28.7475 40.0809C27.9665 40.8619 26.7002 40.8619 25.9191 40.0809C25.1381 39.2998 25.1381 38.0335 25.9191 37.2525L31.1716 32L25.9191 26.7475C25.1381 25.9665 25.1381 24.7002 25.9191 23.9191Z"
                    fill="#DC2626"
                  />
                  <path
                    d="M32.6248 5.7859L34.6876 7.96411V7.96411L32.6248 5.7859ZM35.3752 5.7859L33.3124 7.96411V7.96411L35.3752 5.7859ZM11.6192 13.9977L11.6565 10.9979L11.6565 10.9979L11.6192 13.9977ZM9.69444 15.3729L6.84452 14.4359L9.69444 15.3729ZM33.5015 58.9289L32.7537 61.8342H32.7537L33.5015 58.9289ZM34.4985 58.9289L35.2463 61.8342H35.2463L34.4985 58.9289ZM58.3056 15.3729L55.4556 16.3099V16.3099L58.3056 15.3729ZM56.3808 13.9977L56.3435 10.9979L56.3435 10.9979L56.3808 13.9977ZM28.7475 23.9191L26.6262 26.0404L26.6262 26.0404L28.7475 23.9191ZM25.9191 23.9191L28.0404 26.0404L28.0404 26.0404L25.9191 23.9191ZM34 29.1716L31.8787 31.2929C33.0503 32.4645 34.9497 32.4645 36.1213 31.2929L34 29.1716ZM42.0809 23.9191L39.9596 26.0404L39.9596 26.0404L42.0809 23.9191ZM42.0809 26.7475L44.2022 28.8689L42.0809 26.7475ZM36.8284 32L34.7071 29.8787C34.1445 30.4413 33.8284 31.2043 33.8284 32C33.8284 32.7956 34.1445 33.5587 34.7071 34.1213L36.8284 32ZM39.2525 40.0809L37.1311 42.2022L37.1311 42.2022L39.2525 40.0809ZM34 34.8284L36.1213 32.7071C35.5587 32.1445 34.7956 31.8284 34 31.8284C33.2043 31.8284 32.4413 32.1445 31.8787 32.7071L34 34.8284ZM28.7475 40.0809L30.8689 42.2022L28.7475 40.0809ZM25.9191 40.0809L28.0404 37.9596L28.0404 37.9596L25.9191 40.0809ZM25.9191 37.2525L28.0404 39.3738L28.0404 39.3738L25.9191 37.2525ZM31.1716 32L33.2929 34.1213C34.4645 32.9497 34.4645 31.0503 33.2929 29.8787L31.1716 32ZM25.9191 26.7475L28.0404 24.6262L28.0404 24.6262L25.9191 26.7475ZM34.6876 7.96411C34.302 8.32935 33.698 8.32935 33.3124 7.96411L37.4381 3.60769C35.5098 1.78148 32.4902 1.78148 30.5619 3.60769L34.6876 7.96411ZM12 17C20.7874 17 28.7746 13.5641 34.6876 7.96411L30.5619 3.60769C25.7189 8.19424 19.1926 11 12 11V17ZM11.582 16.9974C11.7211 16.9992 11.8605 17 12 17V11C11.8853 11 11.7708 10.9993 11.6565 10.9979L11.582 16.9974ZM12.5444 16.3099C12.408 16.7245 12.0185 17.0029 11.582 16.9974L11.6565 10.9979C9.47404 10.9708 7.52622 12.3625 6.84452 14.4359L12.5444 16.3099ZM11 26.0002C11 22.6144 11.5424 19.3573 12.5444 16.3099L6.84452 14.4359C5.64623 18.0805 5 21.9698 5 26.0002H11ZM34.2493 56.0236C20.8782 52.5821 11 40.4432 11 26.0002H5C5 43.2479 16.7968 57.7272 32.7537 61.8342L34.2493 56.0236ZM33.7507 56.0236C33.9143 55.9815 34.0858 55.9815 34.2493 56.0236L32.7537 61.8342C33.5712 62.0446 34.4288 62.0446 35.2463 61.8342L33.7507 56.0236ZM57 26.0002C57 40.4432 47.1218 52.5821 33.7507 56.0236L35.2463 61.8342C51.2032 57.7272 63 43.2479 63 26.0002H57ZM55.4556 16.3099C56.4576 19.3573 57 22.6144 57 26.0002H63C63 21.9699 62.3538 18.0805 61.1555 14.4359L55.4556 16.3099ZM56.418 16.9974C55.9816 17.0029 55.592 16.7245 55.4556 16.3099L61.1555 14.4359C60.4738 12.3624 58.526 10.9708 56.3435 10.9979L56.418 16.9974ZM56 17C56.1395 17 56.2789 16.9992 56.4181 16.9974L56.3435 10.9979C56.2292 10.9993 56.1147 11 56 11V17ZM33.3124 7.96411C39.2254 13.5641 47.2126 17 56 17V11C48.8074 11 42.2811 8.19424 37.4381 3.60769L33.3124 7.96411ZM30.8689 21.7978C28.9162 19.8452 25.7504 19.8452 23.7978 21.7978L28.0404 26.0404C27.6499 26.431 27.0167 26.431 26.6262 26.0404L30.8689 21.7978ZM36.1213 27.0503L30.8689 21.7978L26.6262 26.0404L31.8787 31.2929L36.1213 27.0503ZM37.1311 21.7978L31.8787 27.0503L36.1213 31.2929L41.3738 26.0404L37.1311 21.7978ZM44.2022 21.7978C42.2496 19.8452 39.0838 19.8452 37.1311 21.7978L41.3738 26.0404C40.9832 26.431 40.3501 26.431 39.9596 26.0404L44.2022 21.7978ZM44.2022 28.8689C46.1548 26.9162 46.1548 23.7504 44.2022 21.7978L39.9596 26.0404C39.569 25.6499 39.569 25.0168 39.9596 24.6262L44.2022 28.8689ZM38.9497 34.1213L44.2022 28.8689L39.9596 24.6262L34.7071 29.8787L38.9497 34.1213ZM44.2022 35.1311L38.9497 29.8787L34.7071 34.1213L39.9596 39.3738L44.2022 35.1311ZM44.2022 42.2022C46.1548 40.2496 46.1548 37.0838 44.2022 35.1311L39.9596 39.3738C39.569 38.9832 39.569 38.3501 39.9596 37.9596L44.2022 42.2022ZM37.1311 42.2022C39.0838 44.1548 42.2496 44.1548 44.2022 42.2022L39.9596 37.9596C40.3501 37.569 40.9832 37.569 41.3738 37.9596L37.1311 42.2022ZM31.8787 36.9497L37.1311 42.2022L41.3738 37.9596L36.1213 32.7071L31.8787 36.9497ZM30.8689 42.2022L36.1213 36.9497L31.8787 32.7071L26.6262 37.9596L30.8689 42.2022ZM23.7978 42.2022C25.7504 44.1548 28.9162 44.1548 30.8689 42.2022L26.6262 37.9596C27.0168 37.569 27.6499 37.569 28.0404 37.9596L23.7978 42.2022ZM23.7978 35.1311C21.8452 37.0838 21.8452 40.2496 23.7978 42.2022L28.0404 37.9596C28.431 38.3501 28.431 38.9832 28.0404 39.3738L23.7978 35.1311ZM29.0503 29.8787L23.7978 35.1311L28.0404 39.3738L33.2929 34.1213L29.0503 29.8787ZM23.7978 28.8689L29.0503 34.1213L33.2929 29.8787L28.0404 24.6262L23.7978 28.8689ZM23.7978 21.7978C21.8452 23.7504 21.8452 26.9162 23.7978 28.8689L28.0404 24.6262C28.431 25.0167 28.431 25.6499 28.0404 26.0404L23.7978 21.7978Z"
                    fill="white"
                    mask="url(#path-1-outside-1_362_2721)"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_dd_362_2721"
                    x="-3"
                    y="-1"
                    width="74"
                    height="74"
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
                    <feMorphology
                      radius="1"
                      operator="erode"
                      in="SourceAlpha"
                      result="effect1_dropShadow_362_2721"
                    />
                    <feOffset dy="2" />
                    <feGaussianBlur stdDeviation="2" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_362_2721"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feMorphology
                      radius="1"
                      operator="erode"
                      in="SourceAlpha"
                      result="effect2_dropShadow_362_2721"
                    />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="3" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="effect1_dropShadow_362_2721"
                      result="effect2_dropShadow_362_2721"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect2_dropShadow_362_2721"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-red-600 text-sm md:text-2xl">
                Some Risk
              </p>
              <p className="text-black text-sm font-normal leading-6">
                Better look for a different name
              </p>
            </div>
          </div>
        </div> */}

        <div className="space-y-5">
          <p className="text-black font-semibold text-lg leading-6">
            {risk_count} of {checks.length} risks found
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {checks.map(({ check, status, message }) => (
              <div
                key={check}
                className="p-5 flex items-center space-x-4 border border-gray-200 rounded-md bg-gradient-to-r from-gray-200/0 to-gray-50"
              >
                <div className="flex-shrink-0 rounded-full w-12 h-12 border border-gray-200 bg-white flex items-center justify-center">
                  <Status status={status} />
                </div>
                <div className="">
                  <p className="text-black font-semibold text-sm leading-6">
                    {check}
                  </p>
                  <p className="text-gray-500 text-sm leading-6 font-normal">
                    {message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <p className="text-black font-semibold text-lg leading-6">
            Name inspection
          </p>

          {labels.map((label) => (
            <div
              key={label.label}
              className="border border-gray-200 rounded-md divide-y divide-gray-200"
            >
              <div className="py-[10px] px-6 text-sm font-normal">
                {label.label}
              </div>
              {label?.graphemes?.map((grapheme) => (
                <div
                  key={grapheme.grapheme}
                  className="grid grid-cols-8 gap-4 py-5 px-10"
                >
                  <div className="flex items-center justify-center">
                    <p className="text-4xl text-black font-bold">
                      {grapheme.grapheme}
                    </p>
                  </div>
                  <div className="col-span-3 flex-1">
                    <p className="text-black text-sm font-medium">
                      {grapheme.grapheme_name}
                    </p>
                    <p className="text-gray-500 text-sm font-normal">
                      {grapheme.grapheme_script}
                    </p>
                  </div>
                  <div className="col-span-3 flex items-center space-x-3">
                    <Status status={grapheme.rating} />
                    <p className="font-medium text-black text-sm">
                      {grapheme.highest_risk?.message}
                    </p>
                  </div>
                  <div className="flex items-center justify-between ml-auto">
                    <svg
                      width="10"
                      height="18"
                      viewBox="0 0 10 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.25 1.5L8.75 9L1.25 16.5"
                        stroke="#AFAFAF"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
