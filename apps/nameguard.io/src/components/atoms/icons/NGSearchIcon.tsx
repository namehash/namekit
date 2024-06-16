"use client";

import { useSearchStore } from "@namehash/nameguard-react";
import { MagnifyingGlassIcon } from "./MagnifyingGlassIcon";

export function NGSearchIcon() {
  const { openModal } = useSearchStore();
  return (
    <div
      onClick={() => {
        openModal();
      }}
    >
      <MagnifyingGlassIcon />
    </div>
  );
}
