"use client";

import { useEffect, useRef, useState } from "react";

import { MessageList } from "@/components/chatroom";
import { useParams } from "next/navigation";

import { useConversationDetail } from "@/hooks/queries/";

import { ChatInput } from "@/components/common";
import { useRoleplayMessages } from "@/hooks/mutations/messages/useRoleplayMessages";
import { useRoleplayHint } from "@/hooks/queries/useRoleplayHint";
import { NoticeIcon } from "@/assets/svgr";
import { Lightbulb } from "lucide-react";

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
  // const {
  //   micState,
  //   pendingAudioUrl,
  //   sttText,
  //   showVoiceError,
  //   handleMicClick,
  //   handleResetAudio,
  //   handleSendAudio,
  // } = useVoiceChat(conversationId, sendMessage);

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
      </div>
    </div>
  );
}
