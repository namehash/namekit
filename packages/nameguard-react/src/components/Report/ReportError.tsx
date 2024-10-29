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
      <div className="py-9 px-10 flex items-center space-x-6">
        <div className="flex-shrink-0">
          <div className="rounded-full bg-red-50 flex items-center justify-center w-12 h-12">
            <ExclamationTriangleIcon
              className={cc([
                "stroke-current w-5 h-5",
                checkResultCodeTextColor(CheckResultCode.alert),
              ])}
            />
          </div>
        </div>
        <div className="space-y-1 flex-shrink-0">
          <p className="text-black font-semibold text-lg">
            {isOnline ? "Unexpected server error" : "Connection lost"}
          </p>
          <p className="text-gray-500 text-sm">
            {isOnline
              ? "We're working on fixing the problem. Please try again shortly."
              : "Please check your connection and try again."}
          </p>
        </div>
      </div>
    </RatedBox>
  );
};
