import { create } from "zustand";

export type GraphemeModalState = {
  currentGrapheme?: string;
  isGraphemeModalOpen: boolean;
  openGraphemeModal: (grapheme) => void;
  closeGraphemeModal: () => void;
};

export const useGraphemeModalStore = create<GraphemeModalState>((set) => ({
  currentGrapheme: null,
  isGraphemeModalOpen: false,
  openGraphemeModal: (currentGrapheme: string) =>
    set({ isGraphemeModalOpen: true, currentGrapheme }),
  closeGraphemeModal: () =>
    set({ isGraphemeModalOpen: false, currentGrapheme: null }),
}));
