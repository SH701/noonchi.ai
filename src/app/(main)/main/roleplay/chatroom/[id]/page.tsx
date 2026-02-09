"use client";

import { useEffect, useRef, useState } from "react";

import { MessageList } from "@/components/chatroom";
import { useParams } from "next/navigation";

import { useConversationDetail } from "@/hooks/queries/";

import { useVoiceChat } from "@/hooks/useVoiceChat";
import { ChatInput } from "@/components/common";
import { useRoleplayMessages } from "@/hooks/mutations/messages/useRoleplayMessages";

export default function RolePlayChatroomPage() {
  const { id } = useParams<{ id: string }>();

  const [message, setMessage] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: conversation, error: conversationError } =
    useConversationDetail(id);

  const conversationId = conversation?.conversationId;

  const {
    messages,
    sendMessage,
    feedbackOpenId,
    handleFeedbacks,
  } = useRoleplayMessages(conversationId);

  const {
    micState,
    pendingAudioUrl,
    sttText,
    showVoiceError,
    handleMicClick,
    handleResetAudio,
    handleSendAudio,
  } = useVoiceChat(conversationId, sendMessage);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // const isDataLoading = isConversationLoading || isMessagesLoading;
  const hasError = conversationError;

  // if ((isDataLoading && messages.length === 0) || !accessToken) {
  //   return <ChatroomLoading />;
  // }

  if (hasError && messages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">채팅방 정보를 불러오지 못했습니다.</p>
      </div>
    );
  }

  const myAI = conversation?.aiPersona ?? null;
  const handleSendText = async () => {
    await sendMessage(message);
    setMessage("");
  };
  return (
    <div className="min-h-screen  flex flex-col w-full">
      <div className="flex flex-col  overflow-y-auto pb-32">
        <MessageList
          messages={messages}
          myAI={myAI}
          feedbackOpenId={feedbackOpenId}
          handleFeedbacks={handleFeedbacks}
        />
        <div ref={bottomRef} />
      </div>

      <ChatInput
        message={message}
        setMessage={setMessage}
        showHint={true}
        showSituation={true}
        onSend={handleSendText}
      />
    </div>
  );
}
