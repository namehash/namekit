import React from "react";
import { ENSName } from "@namehash/ens-utils";
import { ConsolidatedNameGuardReport } from "@namehash/nameguard";
import { useSearchStore } from "../../stores/search";
import { ReportBadge } from "../..";

interface ReportModalNameBadgeProps {
  data?: ConsolidatedNameGuardReport;
  hadLoadingError?: boolean;
  ensName: ENSName;
}

export function ReportModalNameBadge({
  data,
  ensName,
  hadLoadingError = false,
  ...props
}: ReportModalNameBadgeProps) {
  const { openModal } = useSearchStore();
  return (
    <ReportBadge
      {...props}
      data={data}
      ensName={ensName}
      displayUnnormalizedNames={true}
      hadLoadingError={hadLoadingError}
      onIconClickOverride={(ensName: ENSName) => openModal(ensName.name)}
      onBadgeClickOverride={(ensName: ENSName) => openModal(ensName.name)}
      onTooltipClickOverride={(ensName: ENSName) => openModal(ensName.name)}
    />
  );
}
