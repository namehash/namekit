import React from "react";
import { Rating } from "@namehash/nameguard";
import cc from "classcat";
import { Shield } from "./Shield";

function borderColor(rating: Rating) {
  switch (rating) {
    case "alert": {
      return "border-red-200";
    }
    case "pass": {
      return "border-green-200";
    }
    case "warn": {
      return "border-yellow-200";
    }
    default: {
      return "border-gray-200";
    }
  }
}

function shadowColor(rating: Rating) {
  switch (rating) {
    case "alert": {
      return "shadow-red-50";
    }
    case "pass": {
      return "shadow-green-50";
    }
    case "warn": {
      return "shadow-yellow-50";
    }
    default: {
      return "shadow-gray-50";
    }
  }
}

function textColor(rating: Rating) {
  switch (rating) {
    case "alert": {
      return "text-red-700";
    }
    case "pass": {
      return "text-green-700";
    }
    case "warn": {
      return "text-yellow-700";
    }
    default: {
      return "text-gray-500";
    }
  }
}

interface Props {
  name: string;
  rating: Rating;
  title: string;
  subtitle: string;
}

export const Summary = ({ name, rating, title, subtitle }: Props) => {
  const border = borderColor(rating);
  const shadow = shadowColor(rating);
  const text = cc(["font-semibold text-sm md:text-2xl", textColor(rating)]);

  const wrapperClass = cc([
    "rounded-xl border shadow-2xl p-5 md:py-[30px] md:px-10 flex flex-col md:flex-row md:items-center justify-between divide-y divide-gray-200 md:divide-y-0 space-y-4 md:space-y-0",
    border,
    shadow,
  ]);

  return (
    <div className={wrapperClass}>
      <div className="md:w-4/6">
        <p className="uppercase text-sm text-gray-500 font-medium">
          Rating for
        </p>
        <h1 className="text-2xl md:text-4xl text-black font-semibold md:font-bold">
          {name}
        </h1>
      </div>
      <div className="flex items-center space-x-4 pt-5 md:pt-0 md:w-2/6">
        <Shield status={rating} large />
        <div className="space-y-1">
          <p className={text}>{title}</p>
          <p className="text-black text-sm font-normal leading-6">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};
