import { useConversations } from "@/hooks/queries";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HistoryTab() {
  const router = useRouter();
  const { data } = useConversations();
  const handleHistoryPage = () => {
    router.push("/bothistory/roleplay");
  };
  return (
    <div>
      <button onClick={handleHistoryPage} className="flex gap-2">
        <span className="text-sm font-medium">Role Playing</span>
        <ChevronRight size={20} />
      </button>
      <div className="flex gap-2 overflow-x-auto">
        {data.map((convo) => (
          <div key={convo.conversationId} className="size-30 border flex gap-2 shrink-0">
            {/* topic의 이미지 들어가야함 */}
            {/* Track:주제 TOpic:상황 */}
            <span>{convo.userId}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
