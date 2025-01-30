/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import {
  availableSuffixes,
  PREFERRED_SUFFIX_KEY,
  Suffixes,
} from "../suffix-select";

export const NameWithDefaultSuffix = ({
  name,
  reloadOnChange,
}: {
  name: string;
  reloadOnChange?: boolean;
}) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("storage", () => {
        setSuffix(
          availableSuffixes[
            window.localStorage.getItem(PREFERRED_SUFFIX_KEY) as Suffixes
          ],
        );
      });
    }
  }, []);

  const [suffix, setSuffix] = useState(
    typeof window !== "undefined" &&
      window.localStorage.getItem(PREFERRED_SUFFIX_KEY)
      ? availableSuffixes[
          window.localStorage.getItem(PREFERRED_SUFFIX_KEY) as Suffixes
        ]
      : "",
  );

  /**
   * Below state attests the default Suffix was already get from localStorage
   * and, from the moment below state is true, every change to the suffix will
   * come from the end user input in the user interface, via SuffixSelect.
   */
  const [isNotFirstSuffixChange, setIsNotFirstSuffixChange] = useState(false);
  useEffect(() => {
    if (!isNotFirstSuffixChange) {
      setIsNotFirstSuffixChange(true);
    } else if (reloadOnChange && isNotFirstSuffixChange) {
      window.location.reload();
    }
  }, [suffix]);

  return name + suffix;
};
