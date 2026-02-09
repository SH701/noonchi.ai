import { useConversations } from "@/hooks/queries";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTopics } from "@/hooks/queries/useTopics";

export default function RoleplayHistoryTab() {
  const router = useRouter();
  const { data: conversations } = useConversations();
  const { data: topics = [] } = useTopics("ROLE_PLAYING", false);

  const handleHistoryPage = () => {
    router.push("/bothistory/roleplay");
  };
  console.log(topics);
  return (
    <div className="mb-6">
      <button
        onClick={handleHistoryPage}
        className="flex items-center gap-1 mb-3"
      >
        <span className="text-sm font-medium">Role Playing</span>
        <ChevronRight size={18} className="text-gray-400" />
      </button>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {conversations
          ?.filter((convo) => convo.conversationType === "ROLE_PLAYING")
          .map((convo) => {
            const matchedTopic = topics?.find(
              (topic) => topic.name === convo.conversationTopic,
            );

            return (
              <div
                key={convo.conversationId}
                className="size-32 rounded-2xl overflow-hidden shrink-0 relative border border-white/10 shadow-lg"
              >
                {matchedTopic?.imageUrl ? (
                  <Image
                    src={matchedTopic.imageUrl}
                    alt={convo.conversationTopic}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-600" />
                )}

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                <div className="flex flex-col justify-end p-3 text-white absolute inset-0">
                  <span className="text-[10px] text-gray-300 uppercase tracking-wider">
                    {convo.conversationTrack}
                  </span>
                  <h4 className="text-xs font-bold leading-tight line-clamp-2">
                    {convo.conversationTopic}
                  </h4>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
