"use client";
import { useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

type QueryValue = string | Record<string, any> | null;
type DefaultValues<T> = Partial<Record<keyof T, QueryValue>>;

export function useQueryParams<T extends Record<string, QueryValue>>(
  defaultValues: DefaultValues<T>,
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const parseValue = (value: string): QueryValue => {
    if (!value.includes(",")) return value;

    try {
      const parts = value.split(",");
      const obj = {} as Record<string, any>;

      parts.forEach((part) => {
        const [key, val] = part.split(":");
        obj[key] = isNaN(Number(val)) ? val : Number(val);
      });

      return obj;
    } catch {
      return value;
    }
  };

  const stringifyValue = (value: QueryValue): string => {
    if (typeof value !== "object" || value === null) return String(value);

    return Object.entries(value)
      .map(([k, v]) => `${k}:${v}`)
      .join(",");
  };

  const getParams = useCallback(() => {
    const params = {} as Partial<T>;
    searchParams.forEach((value, key) => {
      if (Object.prototype.hasOwnProperty.call(defaultValues, key)) {
        params[key as keyof T] = parseValue(value) as T[keyof T];
      }
    });

    return {
      ...defaultValues,
      ...params,
    } as T;
  }, [searchParams, defaultValues]);

  const setParams = useCallback(
    (updates: Partial<T>, options?: { replace?: boolean }) => {
      const params = new URLSearchParams(searchParams);
      const currentParams = getParams();
      const newState = { ...currentParams, ...updates };

      Array.from(params.keys()).forEach((key) => params.delete(key));

      Object.entries(newState).forEach(([key, value]) => {
        const defaultValue = defaultValues[key as keyof T];
        if (value !== defaultValue) {
          params.set(key, stringifyValue(value));
        }
      });

      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;

      if (options?.replace) {
        router.replace(url);
      } else {
        router.push(url);
      }
    },
    [pathname, router, searchParams, getParams, defaultValues],
  );

  return { params: getParams(), setParams };
}
