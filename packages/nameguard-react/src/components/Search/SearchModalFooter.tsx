import React from "react";
import { Link } from "@namehash/namekit-react";

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
          <Link onClick={openChatModal} size="xsmall" variant="underline">
            Chat with us
          </Link>
          <Link onClick={openSettingsModal} size="xsmall" variant="underline">
            Search settings
          </Link>
        </div>
        <div className="text-xs text-gray-500">
          Made with ❤️ by{" "}
          <Link
            size="xsmall"
            variant="underline"
            className="!text-black"
            href="https://namehashlabs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            NameHash Labs
          </Link>
        </div>
      </div>
    </div>
  );
};
