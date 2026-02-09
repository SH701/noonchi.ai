import { useConversations } from "@/hooks/queries";

export default function AskHistoryTab() {
  const { data } = useConversations();
  return (
    <div>
      <div className="flex justify-between mb-3 mt-5">
        <span className="text-sm font-medium mb-2">Ask </span>
        <span className="text-xs text-gray-600">Edit</span>
      </div>
      {/* ask 채팅 완료후 타입 ask로 바꿔야함 */}
      {data
        .filter((convo) => convo.conversationType === "ASK")
        .map((convo) => (
          <div key={convo.conversationId} className=" overflow-y-auto mb-5">
            <div className="flex flex-col">
              <span>{convo.status}</span>
              <span>{convo.createdAt}</span>
            </div>
          </div>
        ))}
    </div>
  );
}
