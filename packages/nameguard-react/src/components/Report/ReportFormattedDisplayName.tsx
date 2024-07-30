import React from "react";
import { DisplayedName } from "../DisplayedName/DisplayedName";
import { ENSName, Normalization } from "@namehash/ens-utils";

type Props = {
  name: ENSName;
};

export function ReportFormattedDisplayName({ name }: Props) {
  const displayNameDifferentThanBeautifiedName =
    name.normalization === Normalization.Normalized &&
    name.displayName !== name.name;

  if (displayNameDifferentThanBeautifiedName)
    return (
      <p className="flex text-sm text-gray-500 mt-4">
        <span className="mr-2.5">Generally displays as:</span>
        <DisplayedName name={name} />
      </p>
    );

  return null;
}
