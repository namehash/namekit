import { useEffect, useState } from "react";
import {
  availableSuffixes,
  DEFAULT_PREFFERED_SUFFIX,
  PREFERRED_SUFFIX_KEY,
  Suffixes,
} from "../suffix-select";

export const NameWithDefaultSuffix = ({ name }: { name: string }) => {
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
      : availableSuffixes[DEFAULT_PREFFERED_SUFFIX],
  );

  return <>{name + suffix}</>;
};
