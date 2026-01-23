import { useChatHistoryStore } from "@/store/chathistory/useChatHistorystore";
import { FilterState } from "@/types/conversations";

export default function Filter() {
  const { selectedFilter, setFilter } = useChatHistoryStore();
  const handleFilterClick = (filter: FilterState) => {
    setFilter(selectedFilter === filter ? null : filter);
  };
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => handleFilterClick("done")}
        className={`px-3 pt-1 pb-1.5 rounded-full border text-xs font-medium transition-colors cursor-pointer ${
          selectedFilter === "done"
            ? " text-white bg-[#374151]"
            : "border-gray-300 text-gray-500 bg-white"
        }`}
      >
        Done
      </button>
      <button
        onClick={() => handleFilterClick("in-progress")}
        className={`px-4 pt-1 pb-1.5 rounded-full border text-xs font-medium transition-colors cursor-pointer ${
          selectedFilter === "in-progress"
            ? "text-white bg-[#374151]"
            : "border-gray-300 text-gray-500 bg-white"
        }`}
      >
        In progress
      </button>
    </div>
  );
}
