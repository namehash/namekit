"use client";

import React, { createContext, useContext, useState } from "react";

export type Settings = {
  attemptEnsNormalization: boolean;
  assumedTld: string | null;
  trimWhitespace: boolean;
};

export const defaultSettings: Settings = {
  attemptEnsNormalization: true,
  assumedTld: "eth",
  trimWhitespace: true,
};

type SearchContextType = {
  settings: Settings;
  setSettings: (updatedSettings: Partial<Settings>) => void;
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSettings = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [settings, setInternalSettings] = useState<Settings>(defaultSettings);
  const [open, setOpen] = useState(false);

  const setSettings = (updatedSettings: Partial<Settings>) => {
    setInternalSettings((prevSettings) => ({
      ...prevSettings,
      ...updatedSettings,
    }));
  };

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <SearchContext.Provider
      value={{ settings, setSettings, open, openModal, closeModal }}
    >
      {children}
    </SearchContext.Provider>
  );
};
