"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import {
  useConversationFeedback,
  useConversationDetail,
  useChatQuery,
} from "@/hooks/queries";

import { MessageList } from "@/components/chatroom";

import { ResultTab, Point } from "@/features/result";

import FeedbackPart from "@/features/result/FeedbackPart";

export default function Result() {
  const [tab, setTab] = useState<"transcript" | "mistakes">("transcript");
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);

  const { data: conversation } = useConversationDetail(roomId);
  const myAI = conversation?.aiPersona ?? null;
  const { data: messages = [] } = useChatQuery(roomId);
  const { data: feedback } = useConversationFeedback(roomId);

  if (!feedback) {
    return <p className="p-6">No feedback available</p>;
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <div className="flex-1 flex justify-center overflow-y-auto">
        <div>
          <div className="w-full max-w-125">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-gray-900 text-xl font-semibold font-pretendard leading-[130%]">
                Noonchi coach
              </h2>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
              <p className="text-gray-900 text-base font-medium font-pretendard leading-[130%] mb-4">
                {feedback.overallEvaluation ||
                  "You responded appropriately to the situation, but the tone could be more polite."}
              </p>
            </div>
            <div className="space-y-3">
              <Point label="Politeness" value={feedback.politenessScore} />
              <Point label="Naturalness" value={feedback.naturalnessScore} />
            </div>
          </div>

          <div className="pb-6">
            <ResultTab tab={tab} setTab={setTab} />
            {tab === "transcript" ? (
              <MessageList messages={messages} myAI={myAI} />
            ) : (
              <FeedbackPart summary={feedback.summary} goodPoints={feedback.goodPoints} improvementPoints={feedback.improvementPoints}/>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
