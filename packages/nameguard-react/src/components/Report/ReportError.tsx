import React, { useState, useEffect } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import { RatedBox } from "../RatedBox/RatedBox";

import cc from "classcat";
import { CheckResultCode } from "@namehash/nameguard";
import { checkResultCodeTextColor } from "../../utils/text";

export const ReportError = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return (
    <RatedBox>
      <div className="ng-py-9 ng-px-10 ng-flex ng-items-center ng-space-x-6">
        <div className="ng-flex-shrink-0">
          <div className="ng-rounded-full ng-bg-red-50 ng-flex ng-items-center ng-justify-center ng-w-12 ng-h-12">
            <ExclamationTriangleIcon
              className={cc([
                "ng-stroke-current ng-w-5 ng-h-5",
                checkResultCodeTextColor(CheckResultCode.alert),
              ])}
            />
          </div>
        </div>
        <div className="ng-space-y-1 ng-flex-shrink-0">
          <p className="ng-text-black ng-font-semibold ng-text-lg">
            {isOnline ? "Unexpected server error" : "Connection lost"}
          </p>
          <p className="ng-text-gray-500 ng-text-sm">
            {isOnline
              ? "We're working on fixing the problem. Please try again shortly."
              : "Please check your connection and try again."}
          </p>
        </div>
      </div>
    </RatedBox>
  );
};
