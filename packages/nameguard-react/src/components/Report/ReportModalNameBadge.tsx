import React from "react";
import { ENSName } from "@namehash/ens-utils";
import { useSearchStore } from "../../stores/search";
import { ReportBadge } from "../..";
import { ReportBadgeProps } from "../ReportBadge";

/**
 * Same as `ReportBadgeProps` but without `onOpenReport`
 * since `ReportModalNameBadge` provides its own implementation of
 * `onOpenReport`.
 */
type ReportModalNameBadgeProps = Omit<ReportBadgeProps, 'onOpenReport'>;

export function ReportModalNameBadge({
  name,
  data,
  hadLoadingError,
  displayUnnormalizedNames,
  maxNameDisplayWidth,
  ...props
}: ReportModalNameBadgeProps) {
  const { openModal } = useSearchStore();
  return (
    <ReportBadge
      {...props}
      name={name}
      data={data}
      hadLoadingError={hadLoadingError}
      displayUnnormalizedNames={displayUnnormalizedNames}
      maxNameDisplayWidth={maxNameDisplayWidth}
      onOpenReport={(name: ENSName) => {
        openModal(name.name);
      }}
    />
  );
}
