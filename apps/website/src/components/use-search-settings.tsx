"use client";

import React, { createContext, useContext, useState } from "react";

export type SearchSettings = {
  attemptEnsNormalization: boolean;
  assumedTld: string | null;
  trimWhitespace: boolean;
};

export const defaultSearchSettings: SearchSettings = {
  attemptEnsNormalization: true,
  assumedTld: "eth",
  trimWhitespace: true,
};

type SearchSettingsContextType = {
  settings: SearchSettings;
  setSettings: (updatedSettings: Partial<SearchSettings>) => void;
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
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
  const [open, setOpen] = useState(false);

  const setSettings = (updatedSettings: Partial<SearchSettings>) => {
    setInternalSettings((prevSettings) => ({
      ...prevSettings,
      ...updatedSettings,
    }));
  };

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <SearchSettingsContext.Provider
      value={{ settings, setSettings, open, openModal, closeModal }}
    >
      {children}
    </SearchSettingsContext.Provider>
  );
};
