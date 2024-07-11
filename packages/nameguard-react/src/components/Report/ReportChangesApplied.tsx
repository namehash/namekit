import React from "react";

import { useSettingsStore } from "../../stores/settings";

type Props = {
  transformations?: any[];
};

const transformationText = {
  ens_normalize: "ENS Normalization",
  trim_whitespace: "Trimmed whitespace",
  assume_tld: `Added ".eth"`,
};

export function ReportChangesApplied({ transformations = [] }: Props) {
  const { openModal: openSettingsModal } = useSettingsStore();

  if (transformations.length === 0) return null;

  return (
    <div className="ng-border-t ng-border-gray-200 ng-mx-6 md:ng-mx-0">
      <div className="md:ng-px-10 ng-py-4 md:ng-py-3 ng-flex ng-items-center ng-justify-between">
        <div className="ng-w-full ng-flex ng-items-center ng-flex-wrap">
          <span className="ng-text-sm text-gray-500 ng-mr-2.5 ng-w-full md:ng-w-auto">
            Changes applied to your search:
          </span>
          <div className="ng-space-x-1.5 ng-flex ng-items-center ng-mt-2 md:ng-mt-0">
            {transformations.map((t, i) => (
              <span
                className="ng-bg-gray-100 ng-rounded-full ng-px-3 ng-py-0.5 ng-text-sm ng-font-medium ng-text-black"
                key={i}
              >
                {transformationText[t]}
              </span>
            ))}
          </div>
        </div>
        <div className="md:ng-flex-shrink-0 ng-hidden md:ng-flex md:ng-items-center md:ng-justify-end">
          <button
            className="ng-text-sm ng-text-black ng-leading-5 ng-appearance-none ng-underline sm:ng-underline-offset-[4px] sm:ng-transition-all sm:ng-duration-200 sm:hover:ng-underline-offset-[2px]"
            onClick={openSettingsModal}
          >
            Manage settings
          </button>
        </div>
      </div>
    </div>
  );
}
