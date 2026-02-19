"use client";

import TopicSlider from "@/components/roleplay/TopicSlider";
import { CategoryType } from "@/types/topics";
import { useRouter } from "next/navigation";
import { Heart, Plus } from "lucide-react";
import Image from "next/image";
import {
  useAddFavorite,
  useRemoveFavorite,
} from "@/hooks/mutations/topics/useFavorite";
import { useRecentTopics, useTopics } from "@/hooks/queries/useTopics";

interface TopicListProps {
  category: CategoryType;
  setCategory: (c: CategoryType) => void;
}

export default function TopicList({ category, setCategory }: TopicListProps) {
  const isLove = category === "Favorites";
  const { data: topics = [] } = useTopics(isLove ? "" : category, isLove);
  const { data: recent } = useRecentTopics();
  const router = useRouter();
  const { mutate: addFavorite } = useAddFavorite();
  const { mutate: removeFavorite } = useRemoveFavorite();

  const toggleFavorite = (topicId: number, isFavorite: boolean) => {
    if (isFavorite) {
      removeFavorite(topicId);
    } else {
      addFavorite(topicId);
    }
  };

  return (
    <div>
      <TopicSlider
        topics={[
          { id: 1, label: "Favorites" },
          { id: 2, label: "Career" },
          { id: 3, label: "Family" },
          { id: 4, label: "Belonging" },
          { id: 5, label: "K-POP" },
        ]}
        active={category}
        onSelect={(c) => setCategory(c)}
      />

      {isLove && topics.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full py-20 gap-2 ">
          <span className="text-2xl font-medium">Your Favrites is empty</span>
          <span className="text-sm text-gray-600">
            Tap the heart on roles you like
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 w-full pb-10">
          {topics.map((topic) => (
            <div
              key={topic.topicId}
              className="relative flex flex-col rounded-xl cursor-pointer hover:shadow-md transition-shadow w-41 h-41 overflow-hidden group"
              onClick={() =>
                router.push(
                  `/main/roleplay/create?category=${category}&topicId=${topic.topicId}`,
                )
              }
            >
              <Image
                src={topic.imageUrl}
                alt={topic.name}
                fill
                className="object-cover"
              />
              <div className="flex flex-col justify-end px-4 py-2 text-white gap-1 absolute inset-x-0 bottom-0 h-auto bg-gray backdrop-blur-sm rounded-b-xl">
                <span className="text-xs">{topic.category}</span>
                <h4 className="text-sm font-semibold">{topic.name}</h4>
              </div>
              <button
                className="absolute top-3 right-3 text-white opacity-80 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(topic.topicId, topic.isFavorite);
                }}
              >
                <Heart fill={topic.isFavorite ? "currentColor" : "none"} />
              </button>
            </div>
          ))}
          <button
            className="flex items-center justify-center size-10 bg-white rounded-full z-9999 absolute right-4 bottom-8 border border-gradient-primary"
            onClick={() => router.push("/main/roleplay/create/custom")}
          >
            <Plus />
          </button>
        </div>
      )}
    </div>
  );
}
