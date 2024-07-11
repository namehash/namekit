import React from "react";
import cc from "classcat";
import { CheckResultCodeIcon } from "./CheckResultCodeIcon";
import { CheckResultCode } from "@namehash/nameguard";
import { checkResultCodeTextColor } from "../../utils/text";
import { ShieldExclamationIcon } from "@heroicons/react/20/solid";

type Props = {
  title: string;
  description: string;
};

export function NoGraphemesWarning({ title, description }: Props) {
  return (
    <div className="ng-bg-red-50 ng-grid ng-grid-cols-8 lg:ng-grid-cols-12 ng-gap-4 ng-py-5 ng-pl-6 ng-rounded-b-md">
      <div className="ng-flex md:ng-items-center ng-justify-center">
        <div className="ng-bg-red-100 ng-rounded-full ng-w-12 ng-h-12 ng-flex ng-items-center ng-justify-center ng-flex-shrink-0">
          <ShieldExclamationIcon
            className={cc([
              "ng-w-6 ng-h-6 ng-fill-current",
              checkResultCodeTextColor(CheckResultCode.alert),
            ])}
          />
        </div>
      </div>
      <div className="md:ng-grid md:ng-grid-cols-7 md:ng-gap-4 ng-col-span-7 md:ng-col-span-11 ng-flex ng-items-center md:ng-flex-none ng-flex-wrap">
        <div className="md:ng-col-span-3 ng-flex ng-items-center ng-w-full">
          <p className="ng-text-black ng-text-lg md:ng-text-sm ng-font-semibold md:ng-font-medium">
            {title}
          </p>
        </div>

        <div className="md:ng-col-span-4 ng-flex ng-justify-between ng-space-x-3 ng-w-full">
          <div className="ng-flex ng-flex-row-reverse md:ng-flex-row ng-items-center ng-justify-between md:ng-justify-start ng-space-y-1 md:ng-space-y-0 md:ng-space-x-2 ng-flex-1 ng-pr-6 md:ng-pr-12">
            <CheckResultCodeIcon
              isInteractive={true}
              code={CheckResultCode.alert}
            />
            <p
              className={cc([
                "md:ng-font-medium md:ng-text-black ng-text-sm ng-w-full",
                checkResultCodeTextColor(CheckResultCode.info),
              ])}
            >
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
