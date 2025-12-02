"use client";

import Image from "next/image";
import { useState } from "react";

import ComingSoonModal from "@/components/etc/Comingsoon";
import { CategoryType } from "@/types/topic";
import TopicList from "@/components/topic/TopicList";
import Interviewsection from "@/components/interview/Interviewsection";

export default function Main() {
  const [category, setCategory] = useState<CategoryType>("Career");
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <>
      <div className="w-full py-6 px-7 bg-white">
        <Image
          src="/etc/mainLogo.png"
          width={112}
          height={24}
          alt="Main Logo"
        />
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
