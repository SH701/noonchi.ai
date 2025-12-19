"use client";

import Image from "next/image";

import { CategoryType, Topics } from "@/types/topics";
import { topicsByCategory } from "@/data/topics";
import { useRouter } from "next/navigation";
import { Back } from "@/components/ui/button";
import { useState } from "react";
import { TopicSlider } from "@/components/mainpage";

export default function TopicAll() {
  const [category, setCategory] = useState<CategoryType>("Career");

  const topics = topicsByCategory[category];
  const router = useRouter();

  return (
    <div className="px-5 pt-7  flex gap-3 flex-col">
      <div className="flex justify-between">
        <Back />
        <p className="text-xl text-gray-800 font-semibold pb-3">Topic</p>
        <div></div>
      </div>

      <TopicSlider
        topics={[
          { id: 1, label: "Career" },
          { id: 3, label: "Romance" },
          { id: 4, label: "Belonging" },
          { id: 5, label: "K-POP" },
        ]}
        active={category}
        onSelect={(c) => setCategory(c)}
      />

      <div className="flex flex-col gap-4 w-full ">
        {topics.map((topic: Topics) => (
          <div
            key={topic.id}
            className="flex flex-col gap-3 bg-[#F3F4F6] rounded-xl p-3 cursor-pointer hover:shadow-md transition-shadow  justify-between"
            onClick={() => router.push("/main/create/roleplay")}
          >
            <div className="flex flex-col gap-2 mb-4">
              <h4 className="text-base font-semibold text-gray-900 mb-1.5">
                {topic.title}
              </h4>
              <p className="text-[11px] text-gray-900 leading-4">
                {topic.description}
              </p>
            </div>

            <div className="flex gap-1">
              <div className="w-9 h-4 bg-blue-100 px-1.5 rounded-md flex items-center">
                <Image
                  src="/credits/topicroom.png"
                  alt=""
                  width={24}
                  height={16}
                />
              </div>
              <div className="w-9 h-4 bg-black px-1.5 rounded-md flex items-center">
                <Image
                  src="/credits/report.png"
                  alt=""
                  width={36}
                  height={16}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
