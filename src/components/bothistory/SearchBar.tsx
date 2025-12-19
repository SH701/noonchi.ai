import { useChatHistoryStore } from "@/store/useChatHistorystore";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";

export default function SearchBar() {
  const { keyword, isSearchOpen, setKeyword, toggleSearch } =
    useChatHistoryStore();
  const handleSearchToggle = () => {
    if (isSearchOpen) {
      setKeyword("");
    }
    toggleSearch();
  };
  return (
    <>
      <AnimatePresence>
        {isSearchOpen && (
          <motion.input
            key="search-input"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 120, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { /* empty */ }
            }}
            className="border p-1 rounded overflow-hidden placeholder:pl-1 my-1"
            placeholder="Search..."
            style={{ minWidth: 0 }}
          />
        )}
      </AnimatePresence>
      <button onClick={handleSearchToggle} className="cursor-pointer my-2">
        <MagnifyingGlassIcon className="w-6 h-6 text-gray-700" />
      </button>
    </>
  );
}
