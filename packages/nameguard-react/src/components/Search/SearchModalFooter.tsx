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
    <div className="ng-inset-x-0 ng-z-40">
      <div className="ng-bg-gray-100 ng-flex ng-flex-col md:ng-flex-row ng-items-center ng-justify-between ng-px-5 ng-py-4 ng-border-t ng-border-gray-300 ng-space-y-3 md:ng-space-y-0">
        <div className="ng-flex ng-items-center ng-space-x-3">
          <button
            className="ng-text-xs ng-text-black ng-leading-5 ng-appearance-none ng-underline sm:ng-underline-offset-[4px] sm:ng-transition-all sm:ng-duration-200 sm:hover:ng-underline-offset-[2px]"
            onClick={openChatModal}
          >
            Chat with us
          </button>
          <button
            className="ng-text-xs ng-text-black ng-leading-5 ng-appearance-none ng-underline sm:ng-underline-offset-[4px] sm:ng-transition-all sm:ng-duration-200 sm:ng-hover:underline-offset-[2px]"
            onClick={openSettingsModal}
          >
            Search settings
          </button>
        </div>
        <div className="ng-text-xs ng-text-gray-500">
          Made with ❤️ by{" "}
          <a
            href="https://namehashlabs.org"
            className="ng-text-black ng-underline sm:ng-underline-offset-[4px] sm:ng-transition-all sm:ng-duration-200 sm:hover:ng-underline-offset-[2px]"
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
