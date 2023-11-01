import React from "react";
import { ShieldExclamationIcon } from "@heroicons/react/20/solid";

import { Check } from "./Check";

type Props = {
  title: string;
  description: string;
};

export function UnknownGraphemeCard({ title, description }: Props) {
  return (
    <div className="bg-red-50 grid grid-cols-8 lg:grid-cols-12 gap-4 py-5 pl-6 rounded-b-md">
      <div className="flex md:items-center justify-center">
        <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
          <ShieldExclamationIcon className="w-6 h-6 text-red-600 fill-current" />
        </div>
      </div>
      <div className="md:grid md:grid-cols-7 md:gap-4 col-span-7 md:col-span-11 flex items-center md:flex-none flex-wrap">
        <div className="md:col-span-3 flex items-center w-full">
          <p className="text-black text-lg md:text-sm font-semibold md:font-medium">
            {title}
          </p>
        </div>

        <div className="md:col-span-4 flex justify-between space-x-3 w-full">
          <div className="flex flex-row-reverse md:flex-row items-center justify-between md:justify-start space-y-1 md:space-y-0 md:space-x-2 flex-1 pr-6 md:pr-12">
            <Check code="alert" />
            <p className="md:font-medium text-gray-500 md:text-black text-sm w-full">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
