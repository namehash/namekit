"use client";

import { ReportBadge, useSearchStore } from "@namehash/nameguard-react";

export function HeroReportBadge(props: any) {
  const { openModal } = useSearchStore();

  return (
    <ReportBadge
      {...props}
      onClickOverride={() => openModal(props.data.name)}
    />
  );
}
