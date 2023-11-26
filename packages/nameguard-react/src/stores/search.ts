import { create } from "zustand";

type SearchState = {
  name: string;
  setName: (name: string) => void;

  modalOpen: boolean;
  openModal: (name?: string) => void;
  closeModal: () => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  name: "",
  setName: (name: string) => set({ name }),
  modalOpen: false,
  openModal: (name = "") => set({ modalOpen: true, name }),
  closeModal: () => set({ modalOpen: false }),
}));
