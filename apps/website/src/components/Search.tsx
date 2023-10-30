"use client";

import { SettingsProvider } from "./use-settings";
import { SearchSettingsModal } from "./SettingsModal";
import { ChatModalProvider } from "./use-chat-modal";
import { SearchModal } from "./SearchModal";

export function Search() {
  return (
    <SettingsProvider>
      <ChatModalProvider>
        <SearchModal />
        <SearchSettingsModal />
      </ChatModalProvider>
    </SettingsProvider>
  );
}
