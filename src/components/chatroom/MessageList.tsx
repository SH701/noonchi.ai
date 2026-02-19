/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MyAI } from "@/types/etc/persona.type";

import MessageItem from "./MessageItem";

type MessageListProps = {
  messages: any[];
  myAI: MyAI | null;

  messageStatuses?: Record<string, "default" | "error">;
  showsituation?: boolean;
};

export default function MessageList({
  messages,
  myAI,

  showsituation,
}: MessageListProps) {
  return (
    <>
      {messages.map((m) => {
        const isMine = m.type === "USER";
        const isPending = m.messageId < 0;
        return (
          <MessageItem
            key={m.messageId}
            messages={m}
            myAI={myAI}
            isMine={isMine}
            isPending={isPending}
            showsituation={showsituation}
          />
        );
      })}
    </>
  );
}
