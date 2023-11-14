"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ToggleNameGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  const disabled = Boolean(searchParams.has("disabled"));

  const handleClick = () => {
    router.push(
      disabled
        ? pathname
        : pathname + "?" + createQueryString("disabled", "true")
    );
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    <button
      className="rounded bg-black text-white text-sm font-semibold px-3 py-1.5"
      onClick={handleClick}
    >
      {disabled ? "Enable" : "Disable"} NameGuard
    </button>
  );
}
