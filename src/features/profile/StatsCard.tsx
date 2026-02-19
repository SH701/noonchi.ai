"use client";

import { Info } from "lucide-react";
import HelperSlider from "./Slider";

interface StatsCardProps {
  totalPractices: number;
  avgScore: number;
  bestScore: number;
  currentStreak: string;
  KoreanLevel: number;
}

export default function StatsCard({
  totalPractices,
  avgScore,
  bestScore,
  currentStreak,
  KoreanLevel,
}: StatsCardProps) {
  const stats = [
    { label: "Total Practices", value: totalPractices },
    { label: "Avg. Score", value: avgScore },
    { label: "Best Score", value: bestScore },
    { label: "Current Streak", value: currentStreak },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="text-center bg-white h-23 rounded-2xl pt-4 flex flex-col gap-1"
          >
            <span className="text-gray-400">{stat.label}</span>
            <span className="text-2xl font-bold">{stat.value}</span>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-4 w-full">
        <div className="flex justify-between">
          <div className="flex gap-2 text-sm">
            <span className="text-gray-400 ">Noonchi Level</span>
            <span className="font-extrabold">{KoreanLevel}</span>
          </div>
          <Info className="text-gray-400" />
        </div>

        <div className="flex flex-col  items-center">
          <div>
            <HelperSlider level={3} />
          </div>
          <p>눈치가 상당히 빠르신편</p>
        </div>
      </div>
    </>
  );
}
