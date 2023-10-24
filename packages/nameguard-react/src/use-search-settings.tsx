"use client";

import React, { createContext, useContext, useState } from "react";

export type SearchSettings = {
  attemptNormalization: boolean;
  assumeEth: boolean;
  trimWhitespace: boolean;
};

export const defaultSearchSettings: SearchSettings = {
  attemptNormalization: true,
  assumeEth: true,
  trimWhitespace: true,
};

type SearchSettingsContextType = {
  settings: SearchSettings;
  setSettings: (updatedSettings: Partial<SearchSettings>) => void;
};

const SearchSettingsContext = createContext<
  SearchSettingsContextType | undefined
>(undefined);

export const useSearchSettings = (): SearchSettingsContextType => {
  const context = useContext(SearchSettingsContext);
  if (!context) {
    throw new Error(
      "useSearchSettings must be used within a SearchSettingsProvider"
    );
  }
  return context;
};

export const SearchSettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [settings, setInternalSettings] = useState<SearchSettings>(
    defaultSearchSettings
  );

  const setSettings = (updatedSettings: Partial<SearchSettings>) => {
    setInternalSettings((prevSettings) => ({
      ...prevSettings,
      ...updatedSettings,
    }));
  };

  return (
    <SearchSettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SearchSettingsContext.Provider>
  );
};
