import { useConversations } from "@/hooks/queries";

export default function HistorySection() {
  const { data: conversations } = useConversations();

  return (
    <div>
      {conversations
        ?.filter((convo) => convo.conversationType === "ROLE_PLAYING")
        .map((convo) => (
          <div key={convo.conversationId} className="flex gap-2 space-y-6">
            <div className="flex items-center justify-center bg-gray-300 w-10 h-10 rounded-full shrink-0">
              <span>{convo.aiPersona.name[0].toUpperCase()}</span>
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-semibold">{convo.conversationTopic}</span>
              <span className="text-xs truncate text-gray-600">
                {convo.situation}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}
