"use client";

import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";

export const PREFERRED_SUFFIX_KEY = "PREFERRED_SUFFIX";

export const Suffixes = {
  ETH: "ETH",
  BOX: "BOX",
} as const;
export type Suffixes = (typeof Suffixes)[keyof typeof Suffixes];

export const availableSuffixes: Record<Suffixes, string> = {
  [Suffixes.ETH]: ".eth",
  [Suffixes.BOX]: ".box",
};

export const DEFAULT_PREFFERED_SUFFIX = Suffixes.ETH;

export const SuffixSelect = () => {
  const updatePreferredSuffix = (suffix: Suffixes) => {
    setPreferredSufix(suffix);
  };

  const [preferredSuffix, setPreferredSufix] = useState(
    typeof window !== "undefined" &&
      window.localStorage.getItem(PREFERRED_SUFFIX_KEY)
      ? (window.localStorage.getItem(PREFERRED_SUFFIX_KEY) as Suffixes)
      : DEFAULT_PREFFERED_SUFFIX,
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(PREFERRED_SUFFIX_KEY, preferredSuffix);
      window.dispatchEvent(new Event("storage"));
    }
  }, [preferredSuffix]);

  useEffect(() => {
    if (preferredSuffix) {
      updatePreferredSuffix(preferredSuffix);
    } else {
      updatePreferredSuffix(DEFAULT_PREFFERED_SUFFIX);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferredSuffix]);

  return (
    <Select
      defaultValue={preferredSuffix}
      onValueChange={(newValue) => updatePreferredSuffix(newValue as Suffixes)}
    >
      <SelectTrigger>
        <div className="mr-1">
          {preferredSuffix} ({availableSuffixes[preferredSuffix]})
        </div>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(availableSuffixes).map(([key, value]) => {
          return (
            <SelectItem key={key} value={key}>
              {key} ({value})
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
