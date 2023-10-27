"use client";

import { SearchSettingsProvider } from "./use-search-settings";
import { SearchSettingsModal } from "./SearchSettingsModal";
import { SearchModal } from "./SearchModal";

export function Search() {
  return (
    <SearchSettingsProvider>
      <SearchModal />
      <SearchSettingsModal />
    </SearchSettingsProvider>
  );
}
