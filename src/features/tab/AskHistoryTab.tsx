import { useConversations } from "@/hooks/queries";

export default function AskHistoryTab() {
  const { data } = useConversations();

  return (
    <div className="flex flex-col h-full overflow-hidden ">
      <div className="flex justify-between mt-5 shrink-0">
        <span className="text-sm font-medium mb-2">Ask</span>
        <span className="text-xs text-gray-600 cursor-pointer">Edit</span>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 pr-2 custom-scrollbar">
        {data
          ?.filter((convo) => convo.conversationType === "ASK")
          .map((convo) => (
            <div
              key={convo.conversationId}
              className="mb-2 p-3 bg-white/10 rounded-lg"
            >
              <div className="flex flex-col">
                <span className="text-sm font-bold text-blue-400">
                  {convo.status}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(convo.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
