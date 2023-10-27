import React from "react";

export function ReportHeader() {
  return (
    <div className="space-y-2">
      <h2 className="text-black text-2xl font-semibold">NameGuard Report</h2>
      <p className="text-gray-500 text-sm leading-6 font-normal">
        NameGuard protects you from hidden risks or limitations that an ENS name
        might contain.
      </p>
    </div>
  );
}
