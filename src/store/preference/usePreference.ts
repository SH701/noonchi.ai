import { create } from "zustand";
import { Level } from "@/types/user";

interface PreferenceState {
  koreanLevel: Level | null;
  interests: string[];

  setKoreanLevel: (level: Level) => void;
  setInterests: (list: string[]) => void;

  resetPreferences: () => void;
}

export const usePreferenceStore = create<PreferenceState>()((set) => ({
  koreanLevel: null,
  interests: [],

  setKoreanLevel: (level) => set({ koreanLevel: level }),
  setInterests: (list) => set({ interests: list }),

  resetPreferences: () =>
    set({
      koreanLevel: null,
      interests: [],
    }),
}));
