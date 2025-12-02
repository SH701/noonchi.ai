interface ResultTabProps {
  tab: "transcript" | "mistakes";
  setTab: (value: "transcript" | "mistakes") => void;
}
export default function ResultTab({ tab, setTab }: ResultTabProps) {
  return (
    <div className="py-3.5 mb-4.5">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setTab("transcript")}
          className={`flex-1 py-1.5 text-sm font-semibold transition-all duration-200 border-b-2 text-center ${
            tab === "transcript"
              ? "text-gray-900 border-gray-900"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          Transcript
        </button>

        <button
          onClick={() => setTab("mistakes")}
          className={`flex-1 py-1.5 text-sm font-medium transition-all duration-200 border-b-2 text-center ${
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
