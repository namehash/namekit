import React from "react";
import { CheckResult } from "@namehash/nameguard";
import { CheckResultCodeIcon } from "./CheckResultCodeIcon";

export function CheckResultCard(props: CheckResult) {
  return (
    <div className="ng-p-5 ng-flex md:ng-items-center ng-space-x-4 ng-border ng-border-gray-200 ng-rounded-md ng-bg-gray-50">
      <div className="ng-flex-shrink-0 ng-rounded-full ng-w-12 ng-h-12 ng-border ng-border-gray-200 ng-bg-white ng-flex ng-items-center ng-justify-center">
        <CheckResultCodeIcon isInteractive={true} code={props.status} />
      </div>
      <div className="">
        <p className="ng-text-black ng-font-semibold ng-text-sm ng-leading-6">
          {props.check_name}
        </p>
        <p className="ng-text-gray-500 ng-text-sm ng-leading-6 ng-font-normal">
          {props.message}
        </p>
      </div>
    </div>
  );
}
