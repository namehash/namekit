import { create } from "zustand";

type SearchState = {
  name: string;
  setName: (name: string) => void;

  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  name: "nôtrab",
  setName: (name: string) => set({ name }),
  modalOpen: true,
  openModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),
}));
