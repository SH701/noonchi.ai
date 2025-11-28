"use client";

interface StatsCardProps {
  sentenceCount?: number;
  koreanLevel?: number | string;
}

export default function StatsCard({
  sentenceCount = 0,
  koreanLevel = "",
}: StatsCardProps) {
  return (
    <div className="bg-[#EFF6FF] rounded-2xl border border-blue-200 p-6">
      <div className="flex justify-around">
        <div className="flex flex-col items-center flex-1">
          <span className="text-blue-600 text-sm font-medium mb-2">
            Studied Sentence
          </span>
          <span className="text-gray-900 text-2xl font-bold">
            {sentenceCount}
          </span>
        </div>

        <div className="w-px bg-blue-200 mx-4" />

        <div className="flex flex-col items-center flex-1">
          <span className="text-blue-600 text-sm font-medium mb-2">
            K-Level
          </span>
          <span className="text-gray-900 text-2xl font-bold">
            {koreanLevel}
          </span>
        </div>
      </div>
    </div>
  );
}
