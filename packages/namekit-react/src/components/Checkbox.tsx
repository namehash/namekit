import React, { InputHTMLAttributes } from "react";

export const Checkbox = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      type="checkbox"
      className="nk-form-checkbox nk-h-4 nk-w-4 nk-rounded !nk-border-black nk-text-black !nk-ring-black"
      {...props}
    />
  );
};
