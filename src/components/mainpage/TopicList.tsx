import TopicSlider from "@/components/mainpage/TopicSlider";
import { CategoryType, Topics } from "@/types/topics";
import { topicsByCategory } from "@/data/topics";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import Image from "next/image";

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
  const router = useRouter();

  return (
    <div>
      <TopicSlider
        topics={[
          { id: 1, label: "Career" },
          { id: 3, label: "Family" },
          { id: 4, label: "Belonging" },
          { id: 5, label: "K-POP" },
        ]}
        active={category}
        onSelect={(c) => setCategory(c)}
      />

      <div className="grid grid-cols-2 gap-4 w-full">
        {topics.map((topic: Topics) => {
          return (
            <div
              key={topic.id}
              className="relative flex flex-col rounded-xl cursor-pointer hover:shadow-md transition-shadow w-41 h-41 overflow-hidden group"
              onClick={() =>
                router.push(
                  `/main/create/roleplay?mode=topic&category=${category}&topicId=${topic.id}`,
                )
              }
            >
              <Image src={topic.img} alt="사진" fill className="object-cover" />

              <div className=" flex flex-col justify-end px-4 py-2   text-white gap-1 absolute inset-x-0 bottom-0 h-auto bg-gray backdrop-blur-sm rounded-b-xl">
                <span className="text-xs">{topic.topic}</span>
                <h4 className="text-sm font-semibold ">{topic.title}</h4>
              </div>

              <button
                className="absolute top-3 right-3 text-white opacity-80 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation(); // 찜 로직
                }}
              >
                <Heart />
              </button>
            </div>
          );
        })}

        <div
          className="flex items-end justify-start bg-white rounded-xl cursor-pointer hover:shadow-md transition-colors min-h-40 p-4"
          onClick={() => setShowComingSoon(true)}
        >
          <span className="text-gray-400 font-semibold">Coming soon</span>
        </div>
      </div>
    </div>
  );
}
