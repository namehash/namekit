import { create } from "zustand";

export type ChatModalState = {
  isChatModalOpen: boolean;
  openChatModal: () => void;
  closeChatModal: () => void;
};

export const useChatModalStore = create<ChatModalState>((set) => ({
  isChatModalOpen: false,
  openChatModal: () => set({ isChatModalOpen: true }),
  closeChatModal: () => set({ isChatModalOpen: false }),
}));
