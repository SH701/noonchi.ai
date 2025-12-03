import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Level = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
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

export type Role = "ROLE_GUEST" | "ROLE_USER";

export interface User {
  id: string;
  email: string;
  koreanLevel: Level;
  profileImageUrl: string;
  interests: Interest[];
  role: Role;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;

  // 🔥 새로 추가됨
  me: User | null;

  koreanLevel: Level;
  selectedFace: number | null;
  profileImageUrl: string;
  interests: Interest[];
  role: Role;

  setMe: (user: User | null) => void;
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

      // 🔥 기본값
      me: null,

      role: "ROLE_GUEST",
      koreanLevel: "BEGINNER",
      selectedFace: null,
      profileImageUrl: "",
      interests: [],

      setMe: (user) => set({ me: user }),

      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      setKoreanLevel: (level) => set({ koreanLevel: level }),
      setSelectedFace: (face) => set({ selectedFace: face }),
      setProfileImageUrl: (url) => set({ profileImageUrl: url }),
      setInterests: (list) => set({ interests: list }),
      setRole: (role) => set({ role }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          me: null,
          koreanLevel: "BEGINNER",
          role: "ROLE_GUEST",
          selectedFace: null,
          profileImageUrl: "",
          interests: [],
        }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        me: state.me,
        role: state.role,
        koreanLevel: state.koreanLevel,
        selectedFace: state.selectedFace,
        profileImageUrl: state.profileImageUrl,
        interests: state.interests,
      }),
    }
  )
);
