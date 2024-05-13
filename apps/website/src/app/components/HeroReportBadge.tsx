"use client";

import { ENSName } from "@namehash/ens-utils";
import { ConsolidatedNameGuardReport } from "@namehash/nameguard";
import { ReportBadge, useSearchStore } from "@namehash/nameguard-react";

interface HeroReportBadgeProps {
  data: ConsolidatedNameGuardReport;
  ensName: ENSName;
  props?: any;
}

export function HeroReportBadge({
  data,
  ensName,
  props,
}: HeroReportBadgeProps) {
  const { openModal } = useSearchStore();

  return (
    <ReportBadge
      {...props}
      data={data}
      ensName={ensName}
      displayUnnormalizedNames={true}
      onClickOverride={(ensName: ENSName) => openModal(ensName.name)}
    />
  );
}
