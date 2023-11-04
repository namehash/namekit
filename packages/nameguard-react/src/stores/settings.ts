import { create } from "zustand";

export type Settings = {
  attemptEnsNormalization: boolean;
  assumedTld: string | null;
  trimWhitespace: boolean;
};

export const defaultSettings: Settings = {
  attemptEnsNormalization: true,
  assumedTld: "eth",
  trimWhitespace: true,
};

type State = {
  settings: Settings;
  modalOpen: boolean;
  updateSettings: (newSettings: Partial<Settings>) => void;
  openModal: () => void;
  closeModal: () => void;
};

export const useSettingsStore = create<State>((set) => ({
  settings: defaultSettings,
  modalOpen: false,

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: {
        ...state.settings,
        ...newSettings,
      },
    })),

  openModal: () => set({ modalOpen: true }),

  closeModal: () => set({ modalOpen: false }),
}));
