"use client";

import { useEffect, useRef, useState } from "react";

import { MessageList } from "@/components/chatroom";
import { useParams } from "next/navigation";

import { useConversationDetail } from "@/hooks/queries/";

import { useVoiceChat } from "@/hooks/useVoiceChat";
import { ChatInput } from "@/components/common";
import { useRoleplayMessages } from "@/hooks/mutations/messages/useRoleplayMessages";
import { useRoleplayHint } from "@/hooks/queries/useRoleplayHint";

export default function RolePlayChatroomPage() {
  const { id } = useParams<{ id: string }>();
  const [showHintPanel, setShowHintPanel] = useState(false);
  const [message, setMessage] = useState("");
  const [situationOpen, setSituationOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: conversation, error: conversationError } =
    useConversationDetail(Number(id));

  const conversationId = conversation?.conversationId;

  const { messages, sendMessage } = useRoleplayMessages(conversationId);

  const { data: hintData } = useRoleplayHint(conversationId);
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
  const handleHint = () => {
    setShowHintPanel((prev) => !prev);
  };
  const handleSituation = () => {
    setSituationOpen((prev) => !prev);
  };
  return (
    <div className="min-h-screen  flex flex-col w-full">
      <div className="flex flex-col  overflow-y-auto pb-32">
        <MessageList
          messages={messages}
          myAI={myAI}
          showsituation={situationOpen}
        />
        <div ref={bottomRef} />
      </div>

      <ChatInput
        message={message}
        setMessage={setMessage}
        showHint={true}
        onHintClick={handleHint}
        onSituationClick={handleSituation}
        showSituation={true}
        onSend={handleSendText}
        isHintActive={showHintPanel}
        isSituationActive={situationOpen}
      />
      {showHintPanel && hintData && (
        <div className="fixed bottom-34 left-5 right-5 z-60 flex flex-col gap-2">
          {hintData.map((h, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-gray-100 px-4 py-3 shadow-sm"
            >
              <p className="text-sm text-gray-700">{h}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
