/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useQueryParams } from "../use-query-params";

export const NameWithCurrentTld = ({
  name,
  reloadOnChange,
}: {
  name: string;
  reloadOnChange?: boolean;
}) => {
  const { params } = useQueryParams();

  /**
   * Below state attests the default tld was already get from localStorage
   * and, from the moment below state is true, every change to the tld will
   * come from the end user input in the user interface, via TldSelect.
   */
  const [isNotFirstTldChange, setIsNotFirstTldChange] = useState(false);
  useEffect(() => {
    if (!isNotFirstTldChange) {
      setIsNotFirstTldChange(true);
    } else if (reloadOnChange && isNotFirstTldChange) {
      window.location.reload();
    }
  }, [params.tld.suffix]);

  return `${name}${params.tld.suffix ? params.tld.suffix : ""}`;
};
