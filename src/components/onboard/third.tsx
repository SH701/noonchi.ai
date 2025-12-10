"use client";

import { usePreferenceStore } from "@/store/preference/usePreference";

const INTEREST_OPTIONS = [
  "💬 Daily",
  "💼 Business",
  "✈️ Travel",
  "🎬 K-Drama",
  "🎵 K-Pop",
  "🙇‍♂️ Etiquette",
  "🔥 Internet Slang",
  "🥘 Food",
  "🍜 Ordering",
  "💄 Beauty",
  "👁️‍🗨️ Gathering",
] as const;

export default function Third() {
  const interests = usePreferenceStore((s) => s.interests);
  const setInterests = usePreferenceStore((s) => s.setInterests);

  return (
    <div className="px-4 pt-4 h-full flex flex-col">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        Please select your <br /> interests
      </h1>
      <p className="text-gray-400 mb-8">
        Choose topics you’d like to chat about!
      </p>

      <div className="flex flex-wrap gap-3">
        {INTEREST_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => {
              const next = interests.includes(opt)
                ? interests.filter((x) => x !== opt)
                : [...interests, opt];
              setInterests(next);
            }}
            className="flex items-center text-sm font-medium border px-4 py-2 rounded-full"
            style={{
              borderColor: interests.includes(opt) ? "#316CEC" : "#E5E7EB",
              background: interests.includes(opt) ? "#EFF6FF" : "#FFFFFF",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
