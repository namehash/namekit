"use client";

import { NameBadge, useSearchStore } from "@namehash/nameguard-react";

export function HeroNameBadge(props: any) {
  const { openModal } = useSearchStore();

  return <NameBadge {...props} onClick={() => openModal(props.data.name)} />;
}
