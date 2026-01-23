import { FilterState, SortOrder } from "@/types/conversations";
import { create } from "zustand";

interface ChatHistoryUIState {
  keyword: string;
  isSearchOpen: boolean;
  sort: SortOrder;
  selectedFilter: FilterState;
  expanded: Record<string | number, boolean>;

  setKeyword: (value: string) => void;
  toggleSearch: () => void;
  setSort: (order: SortOrder) => void;
  setFilter: (filter: FilterState) => void;
  toggleExpand: (id: string | number) => void;
  reset: () => void;
}

export const useChatHistoryStore = create<ChatHistoryUIState>((set) => ({
  keyword: "",
  isSearchOpen: false,
  sort: "desc",
  selectedFilter: null,
  expanded: {},

  setKeyword: (value) => set({ keyword: value }),

  toggleSearch: () =>
    set((state) => ({
      isSearchOpen: !state.isSearchOpen,
    })),

  setSort: (order) => set({ sort: order }),

  setFilter: (filter) => set({ selectedFilter: filter }),

  toggleExpand: (id) =>
    set((state) => ({
      expanded: {
        ...state.expanded,
        [id]: !state.expanded[id],
      },
    })),

  reset: () =>
    set({
      keyword: "",
      isSearchOpen: false,
      sort: "desc",
      selectedFilter: null,
      expanded: {},
    }),
}));
