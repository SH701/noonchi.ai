"use client";

import { MyAI } from "@/types/etc/persona.type";

import MessageItem from "./MessageItem";
import { ChatMsg } from "@/types/messages";

interface MessageListProps {
  messages: ChatMsg[];
  myAI: MyAI | null;
  showsituation?: boolean;
}

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
