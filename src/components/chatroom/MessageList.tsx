/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MyAI } from "@/types/etc/persona.type";

import MessageItem from "./MessageItem";

type MessageListProps = {
  messages: any[];
  myAI: MyAI | null;
  feedbackOpenId: number | null;
  handleFeedbacks: (messageId: number) => void;
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
        const isPending = m.messageId < 0;
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
