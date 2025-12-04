/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MyAI } from "@/types/persona";

import MessageItem from "./MessageItem";

type MessageListProps = {
  messages: any[];
  myAI: MyAI | null;
  feedbackOpenId: string | null;

  handleFeedbacks: (messageId: string) => void;

  messageStatuses?: Record<string, "default" | "error">;
};

export default function MessageList({
  messages,
  myAI,
  feedbackOpenId,

  handleFeedbacks,

  messageStatuses = {},
}: MessageListProps) {
  return (
    <>
      {messages.map((m) => {
        const isMine = m.type === "USER";

        return (
          <MessageItem
            key={m.messageId}
            m={m}
            myAI={myAI}
            isMine={isMine}
            isFeedbackOpen={feedbackOpenId === m.messageId}
            feedbackOpenId={feedbackOpenId}
            handleFeedbacks={handleFeedbacks}
            messageStatus={messageStatuses[m.messageId] || "default"}
          />
        );
      })}
    </>
  );
}
