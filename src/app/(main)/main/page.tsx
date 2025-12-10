"use client";

import Image from "next/image";
import { useState } from "react";

import ComingSoonModal from "@/components/modal/Comingsoon";
import { CategoryType } from "@/types/topic";
import { Interviewsection, TopicList } from "@/components/mainpage";
import { useUser } from "@/hooks/queries/useUser";

export default function Main() {
  const [category, setCategory] = useState<CategoryType>("Career");
  const [showComingSoon, setShowComingSoon] = useState(false);
  const { data: user } = useUser();

  return (
    <>
      <div className="w-full py-6 px-7 bg-[#F2F7FF] flex justify-between">
        <Image
          src="/etc/mainLogo.png"
          width={112}
          height={24}
          alt="Main Logo"
        />
        <div className="bg-white px-2 py-1 rounded-4xl flex gap-1">
          <Image
            src="/credits/crediticon.png"
            width={16}
            height={16}
            alt="크레딧"
          />
          <p className="text-sm font-semibold text-gray-600">
            {user?.creditPoint}
          </p>
          <p className="text-xs text-gray-400 pt-0.5">credits</p>
        </div>
      </div>
      <div className=" bg-[#F2F7FF] min-h-screen pb-40">
        <Interviewsection />
        <TopicList
          category={category}
          setCategory={setCategory}
          setShowComingSoon={setShowComingSoon}
        />
        <ComingSoonModal
          isOpen={showComingSoon}
          onClose={() => setShowComingSoon(false)}
        />
      </div>
    </>
  );
}
