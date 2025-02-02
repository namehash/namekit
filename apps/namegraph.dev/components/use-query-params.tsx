"use client";

import { createContext, useContext, useCallback, ReactNode } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { NameGraphSortOrderOptions } from "@namehash/namegraph-sdk/utils";
import { Tlds } from "./collections/utils";
import { NameRelatedCollectionsTabs } from "@/app/name/[name]/name-details-page";

interface QueryParams {
  collectionsSearch: {
    search: string;
    page: number;
    orderBy: NameGraphSortOrderOptions;
    exactMatch: boolean;
  };
  tld: {
    suffix?: Tlds;
  };
  collectionDetails: {
    page: number;
  };
  nameDetails: {
    page?: Record<NameRelatedCollectionsTabs, number | undefined>;
    activeTab: NameRelatedCollectionsTabs;
    orderBy: NameGraphSortOrderOptions;
  };
}

interface QueryParamsContextType {
  params: QueryParams;
  setParams: (
    updates: Partial<QueryParams>,
    options?: { replace?: boolean },
  ) => void;
}

const QueryParamsContext = createContext<QueryParamsContextType | null>(null);

export function QueryParamsProvider({
  children,
  defaultValues,
}: {
  children: ReactNode;
  defaultValues: QueryParams;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const stringifyValue = (value: unknown): string => {
    if (!value || typeof value !== "object") return String(value);

    const nonDefaultEntries = Object.entries(
      value as Record<string, unknown>,
    ).filter(([key, val]) => {
      if (val === null || val === undefined) return false;
      const defaultValue = (defaultValues as any)[key];
      return JSON.stringify(val) !== JSON.stringify(defaultValue);
    });

    if (nonDefaultEntries.length === 0) return "";

    return (
      nonDefaultEntries
        /**
         * underscore for key-value
         */
        .map(([k, v]) => `${k}_${v}`)
        /**
         * dot between pairs
         */
        .join(".")
    );
  };

  const parseValue = (value: string, key: keyof QueryParams) => {
    if (!value.includes("_")) return value;

    try {
      /**
       * Special handling for TLD values to prevent incorrect splitting
       */
      if (key === "tld") {
        const [k, v] = value.split("_");
        return { [k]: v };
      }

      /**
       * Split by dot for other cases
       */
      const parts = value.split(".");
      const obj: Record<string, unknown> = {};

      parts.forEach((part) => {
        /**
         * Split by underscore
         */
        const [k, v] = part.split("_");
        if (v === "true") obj[k] = true;
        else if (v === "false") obj[k] = false;
        else if (!isNaN(Number(v))) obj[k] = Number(v);
        else obj[k] = v;
      });

      return obj;
    } catch {
      return value;
    }
  };

  const getParams = useCallback(() => {
    let params: QueryParams = { ...defaultValues };

    searchParams.forEach((value, key) => {
      if (
        key === "collectionsSearch" ||
        key === "tld" ||
        key === "nameDetails"
      ) {
        const typedKey = key as keyof QueryParams;
        const parsedValue = parseValue(value, typedKey);

        if (typeof parsedValue === "object" && parsedValue !== null) {
          params = {
            ...params,
            [typedKey]: {
              ...params[typedKey],
              ...parsedValue,
            },
          };
        }
      }
    });

    return params;
  }, [searchParams, defaultValues]);

  const setParams = useCallback(
    (updates: Partial<QueryParams>, options?: { replace?: boolean }) => {
      const newParams = new URLSearchParams(searchParams);
      const currentParams = getParams();
      const newState = { ...currentParams, ...updates };

      Array.from(newParams.keys()).forEach((key) => newParams.delete(key));

      Object.entries(newState).forEach(([key, value]) => {
        const defaultValue = defaultValues[key as keyof QueryParams];
        if (JSON.stringify(value) !== JSON.stringify(defaultValue)) {
          const stringified = stringifyValue(value);
          if (stringified) {
            newParams.set(key, stringified);
          }
        }
      });

      const queryString = newParams.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;

      if (options?.replace) {
        router.replace(url);
      } else {
        router.push(url);
      }
    },
    [pathname, router, searchParams, getParams, defaultValues],
  );

  return (
    <QueryParamsContext.Provider value={{ params: getParams(), setParams }}>
      {children}
    </QueryParamsContext.Provider>
  );
}

export function useQueryParams() {
  const context = useContext(QueryParamsContext);
  if (!context) {
    throw new Error("useQueryParams must be used within QueryParamsProvider");
  }
  return context;
}
