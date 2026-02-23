"use client";

import { useEffect, useRef, useState } from "react";

import { MessageList } from "@/components/chatroom";
import { useParams } from "next/navigation";

import { useConversationDetail } from "@/hooks/queries/";

import { ChatInput } from "@/components/common";
import { useRoleplayMessages } from "@/hooks/mutations/messages/useRoleplayMessages";
import { useRoleplayHint } from "@/hooks/queries/useRoleplayHint";
import { useVoiceChat } from "@/hooks/useVoiceChat";
import { NoticeIcon } from "@/assets/svgr";
import { Lightbulb } from "lucide-react";

export default function RolePlayChatroomPage() {
  const { id } = useParams<{ id: string }>();
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
    <div className="min-h-screen flex flex-col w-full">
      <div className="border-y border-white px-5 py-3 flex gap-4 bg-white/50 mb-4 -mx-5">
        <NoticeIcon className="text-gray-600 shrink-0" />
        <span className="text-sm font-medium text-gray-600">
          {conversation?.situation}
        </span>
      </div>
      <div className="flex-1 flex flex-col ">
        <MessageList
          messages={messages}
          myAI={myAI}
          showsituation={situationOpen}
        />
        <div ref={bottomRef} />
      </div>

      <div className="pb-5 flex flex-col backdrop-blur-md">
        {showHintPanel && hintData && (
          <>
            <div className="flex flex-col items-center justify-center gap-2 bg-white border px-3 pt-3 pb-7 shadow-sm rounded-t-[20px] border-white -mb-4">
              <div className="flex gap-2 text-sm text-gray-400 font-medium">
                <Lightbulb className="size-4" />
                <span>Please choose the correct one</span>
              </div>
              {hintData.map((h, idx) => (
                <div
                  key={idx}
                  className="rounded-xl  px-3.5 py-3 border border-gray-300 bg-white/50"
                >
                  <p className="text-sm text-gray-700">{h}</p>
                </div>
              ))}
            </div>
          </>
        )}
        <ChatInput
          message={micState === "recorded" ? sttText : message}
          setMessage={setMessage}
          showHint={true}
          onHintClick={handleHint}
          onSituationClick={handleSituation}
          showSituation={true}
          onSend={micState === "recorded" ? handleSendAudio : handleSendText}
          onMicClick={handleMicClick}
          isHintActive={showHintPanel}
          isSituationActive={situationOpen}
          micState={micState}
        />
      </div>
    </div>
  );
}
