import React from "react";
import { CheckResult, CheckResultCode } from "@namehash/nameguard";
import { CheckResultCodeIcon } from "./CheckResultCodeIcon";

export function CheckResultCard(props: CheckResult) {
  return (
    <div className="p-5 flex md:items-center space-x-4 border border-gray-200 rounded-md bg-gray-50">
      <div className="flex-shrink-0 rounded-full w-12 h-12 border border-gray-200 bg-white flex items-center justify-center">
        <CheckResultCodeIcon isInteractive={true} code={props.status} />
      </div>
      <div className="">
        <p className="text-black font-semibold text-sm leading-6">
          {props.check_name}
        </p>
        <p className="text-gray-500 text-sm leading-6 font-normal">
          {props.message}
        </p>
      </div>
    </div>
  );
}
