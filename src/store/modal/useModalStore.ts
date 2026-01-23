import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  content: React.ReactNode | null;
  actions: {
    openModal: (content: React.ReactNode) => void;
    closeModal: () => void;
  };
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  content: null,
  actions: {
    openModal: (content) => set({ isOpen: true, content }),
    closeModal: () => set({ isOpen: false, content: null }),
  },
}));

export const useModalActions = () => useModalStore((state) => state.actions);
