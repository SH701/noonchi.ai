"use client";

import { useState } from "react";

import ComingSoonModal from "@/components/modal/Comingsoon";
import { CategoryType } from "@/types/topics/topics.type";
import { TopicList } from "@/components/mainpage";

export default function Roleplay() {
  const [category, setCategory] = useState<CategoryType>("Career");
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <>
      <div>
        <div className="flex flex-col gap-3 pb-10">
          <span className="text-3xl font-medium">
            Do you want to sound more natural in Korean?
          </span>
          <span className="text-gray-500">
            Let`s practice role-playing with me.
          </span>
        </div>
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
