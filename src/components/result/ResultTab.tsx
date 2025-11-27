import { useState } from "react";

export default function ResultTab() {
  const [tab, setTab] = useState<"transcript" | "mistakes">("transcript");
  return (
    <div className="px-4 pt-6">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setTab("transcript")}
          className={`flex-1 py-3 text-sm font-medium transition-all duration-200 border-b-2 text-center ${
            tab === "transcript"
              ? "text-blue-600 border-blue-600"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          Transcript
        </button>
        <button
          onClick={() => setTab("mistakes")}
          className={`flex-1 py-3 text-sm font-medium transition-all duration-200 border-b-2 text-center ${
            tab === "mistakes"
              ? "text-blue-600 border-blue-600"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          Common Mistakes
        </button>
      </div>
    </div>
  );
}
