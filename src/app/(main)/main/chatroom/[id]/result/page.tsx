"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useMessages } from "@/hooks/chatroom/useMessage";
import { useConversaitonFeedback } from "@/hooks/conversation/useConversationFeedback";
import { Button } from "@/components/ui/button";
import MessageList from "@/components/chatroom/MessageList";
import { useMessageFeedback } from "@/hooks/chatroom/useMessageFeedback";
import { useConversationDetail } from "@/hooks/conversation/useConversationDetail";
import { ResultTab, Point, Part } from "@/components/result";
import { ChatMsg } from "@/types/chatmessage";

export default function Result() {
  const [tab, setTab] = useState<"transcript" | "mistakes">("transcript");
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: conversation } = useConversationDetail(id);
  const conversationId = conversation?.conversationId ?? 0;
  const myAI = conversation?.aiPersona ?? null;
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [feedbackOpenId, setFeedbackOpenId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { mutate: createFeedback } = useMessageFeedback(conversationId);

  const handleFeedbacks = (messageId: string) => {
    if (feedbackOpenId === messageId) {
      setFeedbackOpenId(null);
      return;
    }

    const targetMessage = messages.find((m) => m.messageId === messageId);
    if (targetMessage?.feedback) {
      setFeedbackOpenId(messageId);
      return;
    }

    createFeedback(messageId, {
      onSuccess: (feedback) => {
        setMessages((prev) =>
          prev.map((m) => (m.messageId === messageId ? { ...m, feedback } : m))
        );
        setFeedbackOpenId(messageId);
      },
    });
  };

  const {
    data: initialMessages = [],
    error: messagesError,
    isLoading: messagesLoading,
  } = useMessages(id);

  const {
    data: feedback,
    error: feedbackError,
    isLoading: feedbackLoading,
  } = useConversaitonFeedback(id);
  useEffect(() => {
    if (!isInitialized && initialMessages && initialMessages.length > 0) {
      setMessages(initialMessages);
      setIsInitialized(true);
    }
  }, [initialMessages, isInitialized]);
  if (messagesLoading || feedbackLoading) {
    return <p className="p-6">Loading...</p>;
  }

  if (messagesError) {
    return (
      <p className="p-6 text-red-500">
        메시지 로드 실패: {messagesError.message}
      </p>
    );
  }
  if (feedbackError) {
    return (
      <p className="p-6 text-red-500">
        피드백 로드 실패: {feedbackError.message}
      </p>
    );
  }

  if (!feedback) {
    return <p className="p-6">No feedback available</p>;
  }
  console.log(feedback);
  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <div className="flex-1 flex justify-center overflow-y-auto">
        <div className="">
          <div className="px-4 pt-6 pb-4  w-full max-w-[500px]">
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/characters/Noonchicoach.svg"
                width={34}
                height={34}
                alt="Noonchi coach"
                className="rounded-full"
              />
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

          {/* Content Section */}
          <div className="px-4 pb-6">
            <ResultTab tab={tab} setTab={setTab} />
            {tab === "transcript" ? (
              <MessageList
                messages={messages}
                myAI={myAI}
                feedbackOpenId={feedbackOpenId}
                handleFeedbacks={handleFeedbacks}
              />
            ) : (
              <div className="space-y-4 pb-2">
                <Part title="Conversation Summary" desc={feedback.summary} />
                <Part title="What you did well" desc={feedback.goodPoints} />
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                  <h3 className="text-gray-900 text-base font-semibold font-pretendard leading-[130%] mb-3">
                    What you can improve
                  </h3>
                  <div className="border-t border-gray-200 pt-3 flex flex-col">
                    <p className="text-gray-700 text-sm font-medium font-pretendard leading-[130%] mb-4">
                      {feedback.improvementPoints?.[0]?.point}
                    </p>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-gray-600 bg-blue-200 w-10 py-1 font-semibold text-center rounded-full text-sm font-pretendard leading-[130%] mb-3">
                        Try
                      </p>
                      <p className="text-gray-700 text-sm font-medium font-pretendard leading-[130%]">
                        {feedback.improvementPoints?.[0]?.tip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="px-4 pb-6 sticky bottom-0 bg-white z-50">
        <Button
          variant="primary"
          size="lg"
          onClick={() => router.push("/main")}
        >
          Complete
        </Button>
      </div>
    </div>
  );
}
