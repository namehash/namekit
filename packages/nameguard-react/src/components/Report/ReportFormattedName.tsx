import React from "react";

type Props = {
  normalization: string;
  name: string;
  displayName: string;
};

export function ReportFormattedDisplayName({
  normalization,
  name,
  displayName,
}: Props) {
  const displayNameDifferent =
    normalization === "normalized" && name !== displayName;

  if (displayNameDifferent)
    return (
      <p className="text-sm text-gray-500 mt-4">
        <span className="mr-2.5">Generally displays as:</span>
        <span className="text-black overflow-hidden overflow-ellipsis whitespace-nowrap font-maxEmojisAndCharsSupport ens-name">
          {displayName}
        </span>
      </p>
    );

  return null;
}
