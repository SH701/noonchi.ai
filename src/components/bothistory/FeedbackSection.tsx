"use client";

import { useRouter } from "next/navigation";
import { useConversationFeedback } from "@/hooks/queries/useConversationFeedback";
import { useDeleteConversation } from "@/hooks/queries/useConversations";

export default function FeedbackSection({ id }: { id: number | string }) {
  const router = useRouter();
  const conversationId = String(id);
  const {
    data: feedback,
    isLoading,
    error,
  } = useConversationFeedback(conversationId);
  const { mutate: deleteConversation } = useDeleteConversation();

  const viewfeedback = () => {
    router.push(`/main/chatroom/${conversationId}/result`);
  };

  const handleDeleteChat = () => {
    deleteConversation(conversationId);
  };

  if (isLoading) return <p>Loading…</p>;
  if (error || !feedback) return <p>피드백 불러오기 실패</p>;

  return (
    <div className="px-5 py-3 bg-gray-50 space-y-3">
      <div className="bg-white p-4 border rounded-2xl border-[#E5E7EB]">
        <p className="text-sm text-gray-700">{feedback.overallEvaluation}</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Politeness</span>
          <span>{feedback.politenessScore} %</span>
        </div>
        <div className="w-full h-2 bg-blue-100 rounded-full">
          <div
            className="h-full bg-blue-400 rounded-full"
            style={{ width: `${feedback.politenessScore}%` }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span>Naturalness</span>
          <span>{feedback.naturalnessScore} %</span>
        </div>
        <div className="w-full h-2 bg-blue-100 rounded-full">
          <div
            className="h-full bg-blue-400 rounded-full"
            style={{ width: `${feedback.naturalnessScore}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-8.5">
        <button
          onClick={viewfeedback}
          className="px-4 min-w-30 h-9 text-white bg-blue-600 rounded-lg cursor-pointer"
        >
          <p className="text-xs">View Feedback</p>
        </button>
        <button
          onClick={handleDeleteChat}
          className="px-4 min-w-20 h-9 text-white bg-gray-300 rounded-lg cursor-pointer"
        >
          <p className="text-xs">Delete</p>
        </button>
      </div>
    </div>
  );
}
