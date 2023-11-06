"use client";

import {
  Report,
  useChatModalStore,
  NameBadge,
} from "@namehash/nameguard-react";

export default function Namekit() {
  return (
    <div className="max-w-5xl mx-auto">
      <div>
        <NameBadge name="notrab.eth" />
        <NameBadge name="notráb.eth" />
        <NameBadge name="notř🏃‍♀️b.eth" />
      </div>

      <Report name="notrab.eth" useChatModalStore={useChatModalStore} />
    </div>
  );
}
