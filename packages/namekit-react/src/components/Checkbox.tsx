import cc from "classcat";
import React, { InputHTMLAttributes } from "react";

export const Checkbox = ({
  className,
  id,
  children,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <label
      className={cc([
        "nk-relative nk-flex nk-items-start nk-flex-row nk-font-medium nk-text-gray-900",
        props.disabled ? "nk-cursor-default" : "nk-cursor-pointer",
      ])}
    >
      <div className="nk-flex nk-h-6 nk-items-center">
        <input
          type="checkbox"
          id={id}
          {...props}
          className={cc([
            "nk-form-checkbox disabled:nk-cursor-default nk-h-4 nk-w-4 nk-rounded nk-border-[1.25px] nk-border-gray-300 nk-text-black nk-cursor-pointer checked:nk-ring-0 focus:nk-ring-0 focus:nk-ring-transparent focus:nk-outline-none focus-visible:nk-border-gray-400 enabled:hover:nk-border-gray-400 disabled:nk-opacity-50 disabled:nk-bg-gray-100 disabled:checked:nk-bg-gray-300",
            className,
          ])}
        />
      </div>
      <div className="nk-ml-3 nk-text-sm nk-leading-6">{children}</div>
    </label>
  );
};
