"use client";

import { ShieldIcon } from "@namehash/nameguard-react";

export default function RatingShieldsPage() {
  return (
    <div className="space-y-7 py-12 max-w-6xl mx-auto">
      <div className="grid grid-cols-5 gap-6">
        <div>Status</div>
        <div>Large</div>
        <div>Medium</div>
        <div>Small</div>
        <div>Micro</div>
      </div>
      <div className="grid grid-cols-5 gap-6">
        <div>Pass</div>

        <ShieldIcon status="pass" size="large" />
        <ShieldIcon status="pass" size="medium" />
        <ShieldIcon status="pass" size="small" />
        <ShieldIcon status="pass" size="micro" />
      </div>
      <div className="grid grid-cols-5 gap-6">
        <div>Warn</div>

        <ShieldIcon status="warn" size="large" />
        <ShieldIcon status="warn" size="medium" />
        <ShieldIcon status="warn" size="small" />
        <ShieldIcon status="warn" size="micro" />
      </div>
      <div className="grid grid-cols-5 gap-6">
        <div>Alert</div>

        <ShieldIcon status="alert" size="large" />
        <ShieldIcon status="alert" size="medium" />
        <ShieldIcon status="alert" size="small" />
        <ShieldIcon status="alert" size="micro" />
      </div>
      <div className="grid grid-cols-5 gap-6">
        <div>Loading</div>

        <ShieldIcon status="info" size="large" />
        <ShieldIcon status="info" size="medium" />
        <ShieldIcon status="info" size="small" />
        <ShieldIcon status="info" size="micro" />
      </div>
      <div className="grid grid-cols-5 gap-6">
        <div>Error</div>

        <ShieldIcon status="skip" size="large" />
        <ShieldIcon status="skip" size="medium" />
        <ShieldIcon status="skip" size="small" />
        <ShieldIcon status="skip" size="micro" />
      </div>
    </div>
  );
}
