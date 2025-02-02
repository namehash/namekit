/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { useQueryParams } from "./use-query-params";
import {
  availableTlds,
  PREFERRED_TLD_LOCALSTORAGE_KEY,
  Tlds,
} from "./collections/utils";

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
   * This component keeps three places aligned
   * in order to store and use visitor's TLD preference:
   * A. URL tld query param
   * B. localStorage PREFERRED_TLD_LOCALSTORAGE_KEY
   * C. Select dropdown selection
   *
   * What summarizes how these keep aligned?
   * [] When component starts with:
   * 1. No tld in URL =>
   * 1.1 Is there a value stored in localStorage? => in the URL tld set the localStorage value
   * 1.2. No value stored in localStorage? => in the URL tld and in the localStorage set DEFAULT_PREFFERED_TLD
   *
   * 2. Tld in the URL =>
   * 2.1 Is there a value stored in localStorage? => in the localStorage value set the URL tld
   * 2.2. No value stored in localStorage? => in the localStorage value set the URL tld
   *
   * [] When select dropdown is used to change the selection
   * 3. In the URL tld and in the localStorage, set the new selection
   */
  const setTLDinLocalStorage = () => {
    console.log(
      params.tld.suffix,
      window.localStorage.getItem(PREFERRED_TLD_LOCALSTORAGE_KEY),
    );
    if (
      params.tld.suffix ===
      window.localStorage.getItem(PREFERRED_TLD_LOCALSTORAGE_KEY)
    ) {
      return;
    }

    if (params && typeof window !== "undefined") {
      /**
       * Mapping use cases listed above:
       */

      if (!params.tld.suffix) {
        /** 1 */
        const valueStoredInLocalStorage = window.localStorage.getItem(
          PREFERRED_TLD_LOCALSTORAGE_KEY,
        );

        if (valueStoredInLocalStorage) {
          /** 1.1 */
          setParams({
            ...params,
            tld: {
              suffix: valueStoredInLocalStorage as Tlds,
            },
          });
        } else {
          /** 1.2 */
          setParams({
            ...params,
            tld: {
              suffix: DEFAULT_PREFFERED_TLD as Tlds,
            },
          });
          window.localStorage.setItem(
            PREFERRED_TLD_LOCALSTORAGE_KEY,
            DEFAULT_PREFFERED_TLD,
          );
          window.dispatchEvent(new Event("storage"));
        }
      } else {
        /** 2 */

        /** It is ok to do this aliasing as params.tld.suffix necessarily exists and is a string */
        const tldFromUrl = params.tld.suffix as string;

        /** 2.1 and 2.2 */
        window.localStorage.setItem(PREFERRED_TLD_LOCALSTORAGE_KEY, tldFromUrl);
      }
    }
  };

  useEffect(() => {
    setTLDinLocalStorage();
  }, [params.tld.suffix]);
  useEffect(() => {
    window.addEventListener("storage", () => {
      setTLDinLocalStorage();
    });

    return () => {
      window.removeEventListener("storage", () => {
        setTLDinLocalStorage();
      });
    };
  }, [params.tld.suffix]);

  return (
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
  );
};
