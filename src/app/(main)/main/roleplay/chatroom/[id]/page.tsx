"use client";

import { useEffect, useRef, useState } from "react";

import { ChatroomInput, MessageList } from "@/components/chatroom";
import { useParams } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";
import { useConversationDetail } from "@/hooks/queries/";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useVoiceChat } from "@/hooks/useVoiceChat";

export default function RolePlayChatRoom() {
  const { id } = useParams<{ id: string }>();

  const [message, setMessage] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: conversation, error: conversationError } =
    useConversationDetail(id);

  const conversationId = conversation?.conversationId;

  const {
    messages,
    sendMessage,
    isAIResponding,
    feedbackOpenId,
    handleFeedbacks,
  } = useChatMessages(conversationId);

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

      <AnimatePresence>
        {showVoiceError && (
          <motion.div
            key="voice-error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed bottom-34.75 left-1/2 -translate-x-1/2 -translate-y-3 z-40 flex flex-col items-center"
          ></motion.div>
        )}
      </AnimatePresence>

      <ChatroomInput
        message={message}
        setMessage={setMessage}
        isAIResponding={isAIResponding}
        sendMessage={handleSendText}
        micState={micState}
        pendingAudioUrl={pendingAudioUrl}
        showVoiceError={showVoiceError}
        handleMicClick={handleMicClick}
        handleResetAudio={handleResetAudio}
        handleSendAudio={handleSendAudio}
        sttText={sttText}
      />
    </div>
  );
}
