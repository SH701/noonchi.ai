import { useConversations } from "@/hooks/queries";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTopics } from "@/hooks/queries/useTopics";
export default function RoleplayHistoryTab() {
  const router = useRouter();
  const { data } = useConversations();
  const handleHistoryPage = () => {
    router.push("/bothistory/roleplay");
  };

  return (
    <div>
      <button onClick={handleHistoryPage} className="flex gap-2">
        <span className="text-sm font-medium mb-2">Role Playing</span>
        <ChevronRight size={20} />
      </button>
      <div className="flex gap-2 overflow-x-auto">
        {data
          .filter((convo) => convo.conversationType === "ROLE_PLAYING")
          .map((convo) => (
            <div
              key={convo.conversationId}
              className="size-30 border flex gap-2 shrink-0 relative"
            >
              

              <div className="flex flex-col justify-end px-4 py-2 text-white gap-1 absolute inset-x-0 bottom-0 h-auto bg-gray backdrop-blur-sm rounded-b-xl">
                <span className="text-xs">{convo.conversationTrack}</span>
                <h4 className="text-sm font-semibold">
                  {convo.conversationTopic}
                </h4>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
