"use client";

import { SearchSettingsProvider } from "./use-search-settings";
import { SearchSettingsModal } from "./SearchSettingsModal";
import { ChatModalProvider } from "./use-chat-modal";
import { SearchModal } from "./SearchModal";

export function Search() {
  return (
    <SearchSettingsProvider>
      <ChatModalProvider>
        <SearchModal />
        <SearchSettingsModal />
      </ChatModalProvider>
    </SearchSettingsProvider>
  );
}
