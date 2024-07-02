"use client";

import { NameGuardReport, ConsolidatedNameGuardReport } from "@namehash/nameguard";
import { Report, useChatModalStore } from "@namehash/nameguard-react";

export function NGReport({
  data,
  name,
}: {
  data: NameGuardReport | ConsolidatedNameGuardReport;
  name: string;
}) {
  return (
    <Report name={name} data={data} useChatModalStore={useChatModalStore} />
  );
}
