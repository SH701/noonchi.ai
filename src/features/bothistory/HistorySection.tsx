'use client'

import { NoteIcon } from "@/assets/svgr";
import { useConversations } from "@/hooks/queries";
import { useRouter } from "next/navigation";

export default function HistorySection() {
  const router = useRouter();
  const { data: conversations } = useConversations();
  const handleReport = (conversationId: number) => {
    router.push(`/main/roleplay/chatroom/${conversationId}/result`)
  }
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
              <div className="flex justify-between">
              <span className="font-semibold">{convo.conversationTopic}</span>
                <button onClick={() => handleReport(convo.conversationId)}>
                  <NoteIcon/>
                </button>
              </div>
              <span className="text-xs truncate text-gray-600">
                {convo.situation}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}
