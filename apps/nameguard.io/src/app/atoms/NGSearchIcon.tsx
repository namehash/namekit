"use client";

import { MagnifyingGlassIcon } from "@/app/atoms/icons/MagnifyingGlassIcon";
import { useSearchStore } from "@namehash/nameguard-react";

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
