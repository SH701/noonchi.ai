"use client";

import { use, useEffect, useRef, useState } from "react";
import { MessageList } from "@/components/chatroom";

import { useConversationDetail } from "@/hooks/queries";
import { ChatInput } from "@/components/common";
import { useRoleplayMessages } from "@/hooks/mutations/messages/useRoleplayMessages";
import { useRoleplayHint } from "@/hooks/queries/useRoleplayHint";
import { useVoiceChat } from "@/hooks/useVoiceChat";
import { NoticeIcon } from "@/assets/svgr";
import ChatroomHeader from "@/features/roleplay/ChatroomHeader";
import HintMessage from "@/components/chatroom/HintMessage";

export default function RolePlayChatroomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [showHintPanel, setShowHintPanel] = useState(false);
  const [message, setMessage] = useState("");
  const [situationOpen, setSituationOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data: conversation } = useConversationDetail(Number(id));
  const conversationId = conversation?.conversationId;
  const { messages, sendMessage } = useRoleplayMessages(conversationId);
  const { data: hintData } = useRoleplayHint(conversationId);
  const { micState, sttText, handleMicClick, handleSendAudio } = useVoiceChat(
    conversationId,
    sendMessage,
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const myAI = conversation?.aiPersona ?? null;

  const handleSendText = async () => {
    setMessage("");
    await sendMessage(message);
  };

  return (
    <>
      <ChatroomHeader
        roomId={Number(id)}
        title={conversation?.conversationTopic ?? ""}
      />
      <div className="min-h-screen flex flex-col w-full">
        <div className="border-y border-white px-5 py-3 flex gap-4 bg-white/50 mb-4 -mx-5">
          <NoticeIcon className="text-gray-600 shrink-0" />
          <span className="text-sm font-medium text-gray-600">
            {conversation?.situation}
          </span>
        </div>
        <div className="flex-1 flex flex-col">
          <MessageList
            messages={messages}
            myAI={myAI}
            showsituation={situationOpen}
          />
          <div ref={bottomRef} />
        </div>

        <div className="pb-5 flex flex-col backdrop-blur-md sticky bottom-0">
          {showHintPanel && hintData && (
            <HintMessage
              hintData={hintData}
              onSelect={(h) => {
                setMessage(h);
                setShowHintPanel(false);
              }}
            />
          )}
          <ChatInput
            message={micState === "recorded" ? sttText : message}
            setMessage={setMessage}
            showHint={true}
            onHintClick={() => setShowHintPanel((prev) => !prev)}
            onSituationClick={() => setSituationOpen((prev) => !prev)}
            showSituation={true}
            onSend={micState === "recorded" ? handleSendAudio : handleSendText}
            onMicClick={handleMicClick}
            isHintActive={showHintPanel}
            isSituationActive={situationOpen}
            micState={micState}
          />
        </div>
      </div>
    </>
  );
}
