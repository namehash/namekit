"use client";

import { DEFAULT_PREFERRED_CURRENCY } from "@namehash/ens-utils";
import { useContext, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { PreferredSufixContext, Sufixes } from "./preferred-sufix-context";

const availableSufixes: Record<
  Sufixes,
  { shortName: string; longName: string }
> = {
  [Sufixes.ETH]: {
    shortName: "$ USD",
    longName: "United States Dollar (USD · $)",
  },
  [Sufixes.BOX]: {
    shortName: "Ξ ETH",
    longName: "Ether (ETH · Ξ)",
  },
};

export const SufixSelect = () => {
  const { preferredCurrency, updatePreferredSufix } = useContext<any>(
    PreferredSufixContext,
  );

  useEffect(() => {
    if (preferredCurrency) {
      updatePreferredSufix(preferredCurrency);
    } else {
      updatePreferredSufix(DEFAULT_PREFERRED_CURRENCY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferredCurrency]);

  return (
    <Select
      defaultValue={Sufixes.ETH}
      onValueChange={(newValue) => updatePreferredSufix(newValue)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(Sufixes).map(([key]) => {
          return (
            <SelectItem key={key} value={key}>
              {key}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
