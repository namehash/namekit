import { useEffect, useState } from "react";
import {
  availableSuffixes,
  DEFAULT_PREFFERED_SUFFIX,
  PREFERRED_SUFFIX_KEY,
  Suffixes,
} from "../suffix-select";
import { useQueryParams } from "../use-query-params";
import { DEFAULT_COLLECTIONS_PARAMS } from "./query-utils";

const getCurrentSuffix = () => {
  return availableSuffixes[
    window.localStorage.getItem(PREFERRED_SUFFIX_KEY) as Suffixes
  ];
};

export const getNameWithCurrentSuffix = (name: string) => {
  return name + getCurrentSuffix();
};

export const NameWithCurrentSuffix = ({ name }: { name: string }) => {
  const { params, setParams } = useQueryParams(DEFAULT_COLLECTIONS_PARAMS);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("storage", () => {
        setNameWithSuffix(getNameWithCurrentSuffix(name));
        setParams({
          ...params,
          tld: getCurrentSuffix(),
        });
      });
    }
  }, []);

  const [nameWithSuffix, setNameWithSuffix] = useState(
    typeof window !== "undefined" &&
      window.localStorage.getItem(PREFERRED_SUFFIX_KEY)
      ? getNameWithCurrentSuffix(name)
      : name + availableSuffixes[DEFAULT_PREFFERED_SUFFIX],
  );

  return <>{nameWithSuffix}</>;
};
