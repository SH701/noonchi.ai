/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MyAI } from "@/types/etc/persona.type";

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
}: MessageListProps) {
  return (
    <>
      {messages.map((m) => {
        const isMine = m.type === "USER";
        const isPending = String(m.messageId).startsWith("temp-");
        return (
          <MessageItem
            key={m.messageId}
            m={m}
            myAI={myAI}
            isMine={isMine}
            isPending={isPending}
            feedbackOpenId={feedbackOpenId}
            handleFeedbacks={handleFeedbacks}
          />
        );
      })}
    </>
  );
}
