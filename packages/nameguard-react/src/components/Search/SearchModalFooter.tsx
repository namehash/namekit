import React from "react";

import {
  type ChatModalState,
  useChatModalStore as defaultUseChatModalStore,
} from "../../stores/chat";
import { useSettingsStore } from "../../stores/settings";

type SearchModalFooterProps = {
  useChatModalStore?: () => ChatModalState;
};

export const SearchModalFooter = ({
  useChatModalStore,
}: SearchModalFooterProps) => {
  const store = useChatModalStore
    ? useChatModalStore()
    : defaultUseChatModalStore();
  const { openChatModal } = store;
  const { openModal: openSettingsModal } = useSettingsStore();

  return (
    <div className="inset-x-0 z-40">
      <div className="bg-gray-100 flex flex-col md:flex-row items-center justify-between px-5 py-4 border-t border-gray-300 space-y-3 md:space-y-0">
        <div className="flex items-center space-x-3">
          <button
            className="text-xs text-black leading-5 appearance-none underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
            onClick={openChatModal}
          >
            Chat with us
          </button>
          <button
            className="text-xs text-black leading-5 appearance-none underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
            onClick={openSettingsModal}
          >
            Search settings
          </button>
        </div>
        <div className="text-xs text-gray-500">
          Made with ❤️ by{" "}
          <a
            href="https://namehashlabs.org"
            className="text-black underline sm:underline-offset-[4px] sm:transition-all sm:duration-200 sm:hover:underline-offset-[2px]"
            target="_blank"
            rel="noreferrer noopener"
          >
            NameHash Labs
          </a>
        </div>
      </div>
    </div>
  );
};
