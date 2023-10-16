"use client";

import { useRouter, useParams } from "next/navigation";
import { useTransition } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { DebounceInput } from "react-debounce-input";

export function Search() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const params = useParams();

  const handleChange = (e: any) => {
    startTransition(() =>
      router.push(`/report/${encodeURIComponent(e.target.value)}`)
    );
  };

  return (
    <div className="relative">
      {!isPending && (
        <div className="h-full absolute flex items-center ml-2">
          <MagnifyingGlassIcon className="w-5 h-5 stroke-current" />
        </div>
      )}
      {isPending && (
        <div className="h-full absolute flex items-center ml-2">
          <div className="flex">
            <span className="animate-[loading_ease-in-out_1.5s_infinite]">
              .
            </span>
            <span className="animate-[loading_ease-in-out_1.5s_infinite_100ms]">
              .
            </span>
            <span className="animate-[loading_ease-in-out_1.5s_infinite_200ms]">
              .
            </span>
          </div>
        </div>
      )}
      <DebounceInput
        value={params?.slug ? decodeURIComponent(params?.slug as string) : ""}
        debounceTimeout={300}
        onChange={handleChange}
        placeholder="Inspect any ENS name"
        className="border border-gray-200 rounded bg-white shadow-sm pl-10 py-1.5 px-2 w-full focus:border-gray-300 focus:ring-0 ring-0"
      />
    </div>
  );
}
