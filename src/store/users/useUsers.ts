import { User } from "@/types/user.type";
import { create } from "zustand";

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,

  setUser: (user) => set({ user: user }),
  clearUser: () => set({ user: null }),
}));
