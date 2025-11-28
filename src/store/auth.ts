import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Level = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "";
export type Interest =
  | "💬 Daily"
  | "💼 Business"
  | "✈️ Travel"
  | "🎬 K-Drama"
  | "🎵 K-Pop"
  | "🙇‍♂️ Etiquette"
  | "🔥 Internet Slang"
  | "🥘 Food"
  | "🍜 Ordering"
  | "💄 Beauty"
  | "👁️‍🗨️ Gathering";
export type Role = "ROLE_GUEST" | "ROLE_USER" | "";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  koreanLevel: Level;
  selectedFace: number | null;
  profileImageUrl: string;
  interests: Interest[];
  role: Role;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setKoreanLevel: (level: Level) => void;
  setSelectedFace: (face: number | null) => void;
  setProfileImageUrl: (url: string) => void;
  setInterests: (list: Interest[]) => void;
  setRole: (role: Role) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      role: "ROLE_GUEST",
      koreanLevel: "BEGINNER",
      selectedFace: null,
      profileImageUrl: "",
      interests: [],

      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      setKoreanLevel: (level) => set({ koreanLevel: level }),
      setSelectedFace: (face) => set({ selectedFace: face }),
      setProfileImageUrl: (url) => set({ profileImageUrl: url }),
      setInterests: (list) => set({ interests: list }),
      setRole: (roles) => set({ role: roles }),

      logout: () => {
        return set({
          accessToken: null,
          refreshToken: null,
          koreanLevel: "",
          role: "",
          selectedFace: null,
          profileImageUrl: "",
          interests: [],
        });
      },
    }),
    {
      name: "accessToken",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        role: state.role,
        koreanLevel: state.koreanLevel,
        selectedFace: state.selectedFace,
        profileImageUrl: state.profileImageUrl,
        interests: state.interests,
      }),
    }
  )
);
