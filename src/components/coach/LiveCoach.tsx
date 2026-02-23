"use client";


import { ChevronLeftIcon } from "@/assets/svgr";
import { Header } from "../common";
import { coach } from "@/data/coach";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function LiveCoach() {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <div className="min-h-screen px-5">
      <Header
        leftIcon={<ChevronLeftIcon onClick={handleBack} />}
        center="Live 1:1 Coaching"
      />
      <div className="p-4 flex flex-col gap-2 border border-white bg-white/50 rounded-xl mb-5">
        <span className="font-semibold">Risk Management Coaching</span>
        <span className="text-sm text-gray-700">
          Decode the hiddden context. Connect with top experts to prevent
          critical relationship failures in Korea.
        </span>
      </div>
      <span className="font-medium">Available Coach</span>
      {coach.map((c) => (
        <div key={c.id} className="py-5 border-b border-gray-400">
          <div className="flex gap-3">
            <Image
              src={c.img}
              alt="profile"
              width={56}
              height={56}
              className="w-14 h-14 shrink-0"
            />
            <div className="flex flex-col">
              <a href={c.link} className="pb-1 font-medium leading-6 underline">
                {c.name}
              </a>
              <span className="pb-3 text-sm text-gray-600">{c.position}</span>
              <div className="flex gap-2">
                {c.career.map((tag) => (
                  <span
                    key={tag}
                    className="p-1 text-xs text-blue-600 bg-blue-100 rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
