/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { useQueryParams } from "./use-query-params";
import {
  availableTlds,
  Tlds,
} from "./collections/tld";

export const DEFAULT_PREFFERED_TLD = availableTlds[Tlds.ETH];

export const TldSelect = () => {
  const { params, setParams } = useQueryParams();

  const updatePreferredTld = (suffix: string) => {
    setParams({
      ...params,
      tld: {
        suffix: suffix as Tlds,
      },
    });
  };

  /**
   * This component keeps two places aligned
   * in order to store and use visitor's TLD preference:
   * A. URL tld query param
   * B. Select dropdown selection
   *
   * What summarizes how these keep aligned?
   * [] When component starts with:
   * 1. No tld in URL =>
   * 1.1. in the URL tld set DEFAULT_PREFFERED_TLD
   *
   * [] When select dropdown is used to change the selection
   * 2. In the URL tld set the new selection
   */
  const setTLD = () => {
    if (params && typeof window !== "undefined") {
      /**
       * Mapping use cases listed above:
       */

      if (!params.tld.suffix) {
        /** 1 */
          /** 1.1 */
          setParams({
            ...params,
            tld: {
              suffix: DEFAULT_PREFFERED_TLD as Tlds,
            },
          });
      }
    }
  };

  useEffect(() => {
    setTLD();
  }, [params.tld.suffix]);

  return (
    <div className="flex space-x-1 items-center w-[200px]">
      <p className="text-sm min-w-[90px] hidden md:block">Parent name</p>
      <Select
        defaultValue={params.tld.suffix}
        onValueChange={(newValue) => updatePreferredTld(newValue as Tlds)}
      >
        <SelectTrigger>
          <div className="mr-1">{params.tld.suffix?.toString()}</div>
        </SelectTrigger>
        <SelectContent>
          {Object.values(availableTlds).map((value) => {
            return (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};
