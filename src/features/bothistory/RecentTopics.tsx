"use client";

import { useRecentTopics } from "@/hooks/queries/useTopics";
import Image from "next/image";
export default function RecentTopic() {
  const { data: recent } = useRecentTopics();

  return (
    <div>
      <p className="text-sm font-medium pb-3">Recent Role Playing</p>
      <div className="flex gap-3 overflow-x-auto">
        {recent?.map((topic) => (
          <div key={topic.topicId} className="relative shrink-0">
            <Image
              src={topic.imageUrl}
              alt="topic image"
              width={162}
              height={162}
              className="rounded-xl"
            />
            <div className="flex flex-col justify-end p-3  absolute inset-0">
              <span className="text-xs text-gray-100 uppercase tracking-wider">
                {topic.category}
              </span>
              <h4 className="text-sm text-white font-medium leading-tight line-clamp-2">
                {topic.name}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
