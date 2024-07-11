import React from "react";
import { DisplayedName } from "../DisplayedName/DisplayedName";
import { ENSName } from "@namehash/ens-utils";
import { Normalization } from "@namehash/nameguard";

type Props = {
  name: ENSName;
};

export function ReportFormattedDisplayName({ name }: Props) {
  const displayNameDifferentThanBeautifiedName =
    name.normalization === Normalization.normalized &&
    name.displayName !== name.name;

  if (displayNameDifferentThanBeautifiedName)
    return (
      <p className="ng-flex ng-text-sm ng-text-gray-500 ng-mt-4">
        <span className="ng-mr-2.5">Generally displays as:</span>
        <DisplayedName name={name} />
      </p>
    );

  return null;
}
