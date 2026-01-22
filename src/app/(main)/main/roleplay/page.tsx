"use client";

import { useState } from "react";

import ComingSoonModal from "@/components/modal/Comingsoon";
import { CategoryType } from "@/types/topics/topics.type";
import { Interviewsection, TopicList } from "@/components/mainpage";

export default function Roleplay() {
  const [category, setCategory] = useState<CategoryType>("Career");
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <>
      <div className="  min-h-screen">
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
