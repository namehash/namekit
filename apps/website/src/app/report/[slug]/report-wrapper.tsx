"use client";

import type { NameGuardReport } from "@namehash/nameguard";
import { Report } from "@namehash/nameguard-react";

export function ReportWrapper({ data }: { data: NameGuardReport }) {
  return (
    <div className="max-w-6xl mx-auto p-6 md:py-12 space-y-8 xl:px-0">
      <Report data={data} />
    </div>
  );
}
