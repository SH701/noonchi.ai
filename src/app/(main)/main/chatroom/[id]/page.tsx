"use client";

import Image from "next/image";

import { useEffect, useRef, useState } from "react";

import {
  ChatroomHeader,
  ChatroomInfo,
  ChatroomInput,
  MessageList,
} from "@/components/chatroom";
import { useParams } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";
import { useConversationDetail } from "@/hooks/queries/";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useVoiceChat } from "@/hooks/useVoiceChat";

export default function ChatroomPage() {
  const { id } = useParams<{ id: string }>();

  const [infoOpen, setInfoOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    data: conversation,
    isLoading: isConversationLoading,
    error: conversationError,
  } = useConversationDetail(id);

  const conversationId = conversation?.conversationId;

  const {
    messages,
    isMessagesLoading,
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
    <div className="min-h-screen bg-white flex flex-col w-full">
      <ChatroomHeader
        name={myAI?.name}
        hidden={hidden}
        setHidden={setHidden}
        conversationId={id}
        onInfoOpen={() => setInfoOpen(true)}
      />

      <div className="flex-1 bg-[#F9FAFB] px-4 py-4 overflow-y-auto">
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
          >
            <Image
              src="/etc/voice_error.png"
              alt="Voice Error"
              width={150}
              height={60}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ChatroomInput
        isTyping={isTyping}
        setIsTyping={setIsTyping}
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

      <ChatroomInfo
        isOpen={infoOpen}
        onClose={() => setInfoOpen(false)}
        companyName={conversation?.interviewCompanyName ?? ""}
        jobTitle={conversation?.interviewJobTitle ?? ""}
        interviewStyle={conversation?.interviewStyle ?? ""}
      />
    </div>
  );
}
