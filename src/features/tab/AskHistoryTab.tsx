import { useConversations } from "@/hooks/queries";
import AskHistorySkeleton from "./AskHistorySkeleton";

export default function AskHistoryTab() {
  const { data, isPending } = useConversations();

  return (
    <div className="flex flex-col h-full overflow-hidden ">
      <div className="flex justify-between mt-5 shrink-0">
        <span className="text-sm font-medium mb-2">Ask</span>
        <span className="text-xs text-gray-600 cursor-pointer">Edit</span>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 pr-2 custom-scrollbar mb-23">
        {isPending ? (
          <AskHistorySkeleton />
        ) : data
          ?.filter((convo) => convo.conversationType === "ASK")
          .map((convo) => (
            <div
              key={convo.conversationId}
              className="mb-2 p-3 bg-white/10 rounded-lg"
            >
              <div className="flex flex-col">
                <span className="text-sm font-bold text-blue-500">
                  {convo.askTarget.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(convo.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
