"use client";

interface StatsCardProps {
  sentenceCount?: number;
  koreanLevel?: string;
}

export default function StatsCard({
  sentenceCount = 0,
  koreanLevel = "",
}: StatsCardProps) {
  return (
    <div className="bg-[#EFF6FF] rounded-2xl border border-blue-200 p-6">
      <div className="flex justify-around">
        <div className="flex flex-col items-center flex-1">
          <p className="text-blue-600 text-sm font-medium mb-2">
            Studied Sentence
          </p>
          <p className="text-gray-900 text-2xl font-bold">{sentenceCount}</p>
        </div>

        <div className="w-px bg-blue-200 mx-4" />

        <div className="flex flex-col items-center flex-1">
          <p className="text-blue-600 text-sm font-medium mb-2">K-Level</p>
          <p className="text-gray-900 text-2xl font-bold">{koreanLevel}</p>
        </div>
      </div>
    </div>
  );
}
