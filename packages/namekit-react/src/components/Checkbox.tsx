import cc from "classcat";
import React, { InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

export const Checkbox = ({ label, description, ...props }: CheckboxProps) => {
  return (
    <div className="relative flex items-start">
      <div className="flex h-6 items-center">
        <input
          type="checkbox"
          {...props}
          className={cc([
            "nk-form-checkbox nk-h-4 nk-w-4 nk-rounded nk-border-[1.25px] nk-border-gray-300 nk-text-black nk-ring-0 nk-cursor-pointer checked:nk-ring-0 focus:nk-ring-0 focus:nk-ring-transparent focus:nk-outline-none focus-visible:nk-border-gray-400 active:nk-ring-0 enabled:hover:nk-border-gray-400 disabled:nk-cursor-not-allowed disabled:nk-opacity-50 disabled:nk-bg-gray-100 disabled:checked:nk-bg-gray-300",
            props.className,
          ])}
        />
      </div>
      {label && (
        <div className="ml-3 text-sm leading-6">
          <label
            htmlFor={props.id}
            className="font-medium text-gray-900 cursor-pointer"
          >
            {label}
          </label>
          {description && (
            <p
              id={`${props.id}-description`}
              className="text-gray-500 text-sm leading-5"
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
