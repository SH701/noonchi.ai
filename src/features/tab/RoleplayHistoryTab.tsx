import { useConversations } from "@/hooks/queries";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTopics } from "@/hooks/queries/useTopics";
import { ChevronRightIcon } from "@/assets/svgr";
import RoleplayHistorySkeleton from "./RoleplayHistorySkeleton";
import { useChatHistoryStore } from "@/store/chathistory/useChatHistorystore";

export default function RoleplayHistoryTab() {
  const router = useRouter();
  const { keyword } = useChatHistoryStore();
  const { data: conversations, isPending: isConversationsPending } = useConversations();
  const { data: topics = [], isPending: isTopicsPending } = useTopics("", false);
  const isPending = isConversationsPending || isTopicsPending;

  const handleHistoryPage = () => {
    router.push("/bothistory/roleplay");
  };
  return (
    <div>
      <button
        onClick={handleHistoryPage}
        className="flex items-center gap-1 mb-3"
      >
        <span className="text-sm font-medium">Role Playing</span>
        <ChevronRightIcon size={18} className="text-gray-400" />
      </button>
      {isPending ? (
        <RoleplayHistorySkeleton />
      ) : (
        <div className="flex gap-3 overflow-x-auto ">
          {conversations
            ?.filter((convo) => convo.conversationType === "ROLE_PLAYING")
            .filter((convo) =>
              keyword
                ? convo.conversationTopic.toLowerCase().includes(keyword.toLowerCase())
                : true,
            )
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
      )}
    </div>
  );
}
