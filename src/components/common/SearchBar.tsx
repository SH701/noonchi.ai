"use client";

import { SearchIcon } from "@/assets/svgr";
import { useChatHistoryStore } from "@/store/chathistory/useChatHistorystore";

export default function SearchBar() {
  const { keyword, setKeyword } = useChatHistoryStore();

  return (
    <div className="relative w-full">
      <input
        key="search-input"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            /* empty */
          }
        }}
        className="w-full border border-white bg-white/70 p-3 rounded-full pl-10 overflow-hidden h-12"
        placeholder="Search for chats"
        style={{ minWidth: 0 }}
      />
      <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2" />
    </div>
  );
}
