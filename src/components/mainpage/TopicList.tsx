import TopicSlider from "@/components/mainpage/TopicSlider";
import { CategoryType, Topics } from "@/types/topics";
import { topicsByCategory } from "@/data/topics";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import { useState } from "react";
import { X } from "lucide-react";
import { useUIStore } from "@/store/uiStore";

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
  const setBottomSheetOpen = useUIStore((s) => s.setBottomSheetOpen);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const handleTopicClick = () => {
    const next = !isBottomSheetOpen;
    setIsBottomSheetOpen(next);
    setBottomSheetOpen(next);
  };
  const [selectedTopic, setSelectedTopic] = useState<Topics | null>(null);

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
        <div
          className="flex items-center justify-center bg-white rounded-xl cursor-pointer hover:shadow-md transition-colors min-h-40"
          onClick={() => setShowComingSoon(true)}
        >
          <span className="text-blue-600 font-semibold">+ Create Chat</span>
        </div>

        {topics.map((topic: Topics) => {
          return (
            <div
              key={topic.id}
              className="flex flex-col bg-white border border-gray-200 rounded-xl p-3 cursor-pointer hover:shadow-md transition-shadow min-h-40 justify-between"
              onClick={() => {
                setSelectedTopic(topic);
                handleTopicClick();
              }}
            >
              <div className="flex flex-col gap-2 mb-4 bg-blur">
                <span>{topic.topic}</span>
                <h4 className="text-base font-semibold text-gray-900 mb-1.5">
                  {topic.title}
                </h4>
              </div>
            </div>
          );
        })}
        <AnimatePresence>
          {isBottomSheetOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-40 p-6 min-h-[10vh] pb-24 rounded-t-3xl"
            >
              <div className="flex-1 overflow-y-auto px-6">
                <div className="mb-6 flex flex-col items-center">
                  <div className="relative flex items-center w-full mb-4">
                    <p className="absolute left-1/2 -translate-x-1/2 text-sm font-medium">
                      Topic Mission
                    </p>
                    <X
                      onClick={handleTopicClick}
                      className="ml-auto cursor-pointer"
                    />
                  </div>

                  <div className="flex items-end gap-1 text-blue-600 font-semibold mb-2">
                    <p className="text-3xl leading-none">30</p>
                    <p className="text-2xl leading-none">credit</p>
                  </div>

                  {selectedTopic && (
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() =>
                        router.push(
                          `/main/create/roleplay?mode=topic&category=${category}&topicId=${selectedTopic.id}`,
                        )
                      }
                    >
                      Start Chatting
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
