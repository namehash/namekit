import React from "react";
import { DisplayedName } from "../DisplayedName/DisplayedName";
import { ENSName } from "@namehash/ens-utils";
import { Normalization } from "@namehash/nameguard";

type Props = {
  name: ENSName;
  normalization: string;
  beautifiedName?: string;
};

export function ReportFormattedDisplayName({
  beautifiedName,
  normalization,
  name,
}: Props) {
  const displayNameDifferentThanBeautifiedName =
    normalization === Normalization.normalized &&
    (name.displayName !== beautifiedName || !beautifiedName);

  if (displayNameDifferentThanBeautifiedName)
    return (
      <p className="flex text-sm text-gray-500 mt-4">
        <span className="mr-2.5">Generally displays as:</span>
        <DisplayedName name={name} />
      </p>
    );

  return null;
}
