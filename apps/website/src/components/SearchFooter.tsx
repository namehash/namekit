import { useChatModal } from "./use-chat-modal";
import { useSettings } from "./use-settings";

export function SearchFooter() {
  const { openModal: openSettingsModal } = useSettings();
  const { openModal: openChatModal } = useChatModal();

  return (
    <div className="bg-gray-100 flex flex-col md:flex-row items-center justify-between px-5 py-4 border-t border-gray-300 space-y-3 md:space-y-0">
      <div className="flex items-center space-x-3">
        <button
          className="text-xs text-black underline leading-5 appearance-none"
          onClick={openChatModal}
        >
          Chat with us
        </button>
        <button
          className="text-xs text-black underline leading-5 appearance-none"
          onClick={openSettingsModal}
        >
          Search settings
        </button>
      </div>
      <div className="text-xs text-gray-500">
        Made with ❤️ by{" "}
        <a href="https://namehash.io" className="text-black underline">
          NameHash
        </a>
      </div>
    </div>
  );
}
