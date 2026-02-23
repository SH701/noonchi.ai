"use client";

import { ChevronDownIcon } from "@/assets/svgr";
import { useChatHistoryStore } from "@/store/chathistory/useChatHistorystore";

import { useState } from "react";

export default function HistorySort() {
  const { sort, setSort } = useChatHistoryStore();
  const [openSortDropdown, setOpenSortDropdown] = useState(false);
  return (
    <div className="relative flex items-center justify-between mb-2">
      <span className="text-sm">All</span>
      <button
        onClick={() => setOpenSortDropdown((prev) => !prev)}
        className="flex items-center gap-1 text-xs cursor-pointer rounded"
      >
        {sort === "asc" ? "Oldest activity" : "Latest activity"}
        <ChevronDownIcon
          className={`size-3 transform transition-transform pt-0.5 shrink-0 ${
            openSortDropdown ? "rotate-180" : ""
          }`}
        />
      </button>

      {openSortDropdown && (
        <div className="absolute right-6 top-full mt-0.5 w-25 z-10 bg-white border border-gray-200 rounded-md shadow-sm">
          <button
            onClick={() => {
              setSort("desc");
              setOpenSortDropdown(false);
            }}
            className={`w-full text-center px-1 py-2 text-xs hover:bg-gray-100 ${
              sort === "desc" ? "bg-gray-50 font-medium text-blue-600" : ""
            }`}
          >
            Latest activity
          </button>
          <button
            onClick={() => {
              setSort("asc");
              setOpenSortDropdown(false);
            }}
            className={`w-full text-center px-1 py-2 text-xs hover:bg-gray-100 ${
              sort === "asc" ? "bg-gray-50 font-medium text-blue-600" : ""
            }`}
          >
            Oldest activity
          </button>
        </div>
      )}
    </div>
  );
}
