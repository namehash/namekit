import React, { InputHTMLAttributes } from "react";

export const Checkbox = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      type="checkbox"
      className="nk-form-checkbox nk-h-4 nk-w-4 nk-rounded nk-border-[1.25px] nk-border-gray-300 nk-text-black nk-ring-0 nk-cursor-pointer checked:nk-ring-0 focus:nk-ring-0 focus:nk-ring-transparent focus:nk-outline-none focus-visible:nk-border-gray-400 active:nk-ring-0 hover:nk-border-gray-400 disabled:nk-cursor-not-allowed disabled:nk-opacity-50 disabled:nk-bg-gray-100 disabled:checked:nk-bg-gray-300"
      {...props}
    />
  );
};
