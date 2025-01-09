// hooks/useQueryParams.ts
"use client";
import { useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

type DefaultValues<T> = Partial<Record<keyof T, string>>;

export function useQueryParams<T extends Record<string, string>>(
  defaultValues: DefaultValues<T>,
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getParams = useCallback(() => {
    const params = {} as Partial<T>;
    searchParams.forEach((value, key) => {
      // Only set the param if it's a valid key of T
      if (Object.prototype.hasOwnProperty.call(defaultValues, key)) {
        params[key as keyof T] = value as T[keyof T];
      }
    });

    // Merge with default values for any missing parameters
    return {
      ...defaultValues,
      ...params,
    } as T;
  }, [searchParams, defaultValues]);

  const setParams = useCallback(
    (updates: Partial<T>, options?: { replace?: boolean }) => {
      const params = new URLSearchParams(searchParams);
      const currentParams = getParams();

      // First, apply the updates to our current state
      const newState = { ...currentParams, ...updates };

      // Clear existing params
      Array.from(params.keys()).forEach((key) => params.delete(key));

      // Only add params that differ from defaults
      Object.entries(newState).forEach(([key, value]) => {
        const defaultValue = defaultValues[key as keyof T];
        if (value !== defaultValue) {
          params.set(key, value as string);
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
