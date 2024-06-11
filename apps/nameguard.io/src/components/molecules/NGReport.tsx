"use client";

import { NameGuardReport } from "@namehash/nameguard";
import { Report, useChatModalStore } from "@namehash/nameguard-react";

export function NGReport({
  data,
  name,
}: {
  data?: NameGuardReport;
  name: string;
}) {
  return (
    <Report name={name} data={data} useChatModalStore={useChatModalStore} />
  );
}
