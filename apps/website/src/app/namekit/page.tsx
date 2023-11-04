"use client";

import { Report, useChatModalStore } from "@namehash/nameguard-react";

export default function Namekit() {
  return (
    <div className="max-w-5xl mx-auto">
      <Report name="notrab.eth" useChatModalStore={useChatModalStore} />
    </div>
  );
}
