import Image from "next/image";
import Link from "next/link";
import TopicSlider from "@/components/topic/TopicSlider";
import { CategoryType, Topics } from "@/types/topic";
import { topicsByCategory } from "@/data/topics";

type TopicListProps = {
  category: CategoryType;
  setCategory: (c: CategoryType) => void;
  setShowComingSoon: (state: boolean) => void;
};

export default function TopicList({
  category,
  setCategory,
  setShowComingSoon,
}: TopicListProps) {
  const topics = topicsByCategory[category];

  return (
    <div className="px-5">
      <div className="flex justify-between">
        <p className="text-xl text-gray-800 font-semibold pb-3">Topic</p>
        <Link href="/main/topicall">
          <p className="text-[13px] font-medium text-gray-400">View all</p>
        </Link>
      </div>

      <TopicSlider
        topics={[
          { id: 1, label: "Career" },
          { id: 2, label: "Family" },
          { id: 3, label: "Romance" },
          { id: 4, label: "Belonging" },
          { id: 5, label: "K-POP" },
        ]}
        active={category}
        onSelect={(c) => setCategory(c)}
      />

      <div className="grid grid-cols-2 gap-4 w-full py-4">
        <div
          className="flex items-center justify-center bg-white rounded-xl cursor-pointer hover:shadow-md transition-colors min-h-40"
          onClick={() => setShowComingSoon(true)}
        >
          <span className="text-blue-600 font-semibold">+ Create Chat</span>
        </div>

        {topics.map((topic: Topics) => (
          <div
            key={topic.id}
            className="flex flex-col bg-white border border-gray-200 rounded-xl p-3 cursor-pointer hover:shadow-md transition-shadow min-h-40 justify-between"
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
