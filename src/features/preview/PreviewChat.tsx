"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  usePreviewRemove,
  usePreviewSend,
  usePreviewStart,
} from "@/hooks/mutations/";
import { ChatInput, ChatLoading, Header } from "../../components/common";

import MessageItem from "../../components/chatroom/MessageItem";

import { useRouter } from "next/navigation";
import { usePreviewHint } from "@/hooks/queries/usePreviewHint";
import { PreviewModal } from "../../components/modal";
import { HamburgerIcon, InfoIcon, NoticeIcon } from "@/assets/svgr";
import {useVoiceChat} from "@/hooks/useVoiceChat";

interface AiMessage {
  content: string;
  hiddenMeaning: string;
  isRevealed: boolean;
}

export default function PreviewChat() {
  const { data, mutate, isPending } = usePreviewStart();
  const { data: hintData } = usePreviewHint(data?.session_id);
  const [message, setMessage] = useState("");
  const [userMessages, setUserMessages] = useState<string[]>([]);
  const [aiResponses, setAiResponses] = useState<AiMessage[]>([]);
  const [firstHiddenMessage, setFirstHiddenMessage] = useState(false);
  const [showHintPanel, setShowHintPanel] = useState(false);
  const [showSituation, setShowSituation] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const router = useRouter();

  const handleChunk = useCallback((chunk: string) => {
    setAiResponses((prev) => {
      const newResponses = [...prev];
      if (newResponses.length > 0) {
        newResponses[newResponses.length - 1].content = chunk;
      }
      return newResponses;
    });
  }, []);

  const { mutate: sendMessage } = usePreviewSend(handleChunk);
  const { mutate: removePreview } = usePreviewRemove();
  const { micState, sttText, handleMicClick, handleSendAudio } = useVoiceChat(
  3000 
);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    mutate();
  }, [mutate]);

  const handleSend = () => {
    if (!data?.session_id || !message.trim()) return;

    setUserMessages((prev) => [...prev, message]);

    setAiResponses((prev) => [
      ...prev,
      { content: "", hiddenMeaning: "", isRevealed: false },
    ]);

    sendMessage(
      { sessionId: data.session_id, userMessage: message },
      {
        onSuccess: (res) => {
          setAiResponses((prev) => {
            const newResponses = [...prev];
            newResponses[newResponses.length - 1].hiddenMeaning =
              res.ai_hidden_meaning;
            return newResponses;
          });
          if (res.is_preview_ended) {
            removePreview(data.session_id);
            setShowPreviewModal(true);
          }
        },
        onError: (error) => {
          if (error.message.includes("429")) {
            removePreview(data.session_id);
            router.push("/preview/end");
          }
        },
      },
    );
    setMessage("");
  };

  const toggleReveal = (idx: number) => {
    setAiResponses((prev) =>
      prev.map((msg, i) =>
        i === idx ? { ...msg, isRevealed: !msg.isRevealed } : msg,
      ),
    );
  };
  const handleHint = () => {
    setShowHintPanel((prev) => !prev);
  };
  const handleMoveAuth = () => {
    router.push("/preview/end");
  };
  const handleHiddenMessage = () => {
    setFirstHiddenMessage((prev) => !prev);
  };
  const handleSituation = () => {
    setShowSituation((prev) => !prev);
  };
  return (
    <div className="h-screen flex flex-col">
      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto px-5">
        <div className="sticky top-0 ">
          <Header
            leftIcon={<HamburgerIcon />}
            center="RolePlay Preview"
            rightIcon="Skip"
            className="text-gray-600 font-medium"
            onRightClick={handleMoveAuth}
          />
        </div>
        {isPending ? (
          <ChatLoading />
        ) : (
          <>
            <div className="border-y border-white px-5 py-3 flex gap-4 bg-white/50 -mx-5 mb-4">
              <NoticeIcon className="text-gray-600 shrink-0" />
              <span className="text-sm font-medium text-gray-600">
                {data?.scenario.description}
              </span>
            </div>
            {/* 첫 AI 메세지 */}
            <MessageItem
              messages={{
                content: data?.ai_message ?? "",
                visualAction: data?.visual_action,
              }}
              aiName={data?.ai_name}
              isPreview={true}
              hiddenMeaning={data?.ai_hidden_meaning}
              isRevealed={firstHiddenMessage}
              onToggleReveal={handleHiddenMessage}
              showsituation={showSituation}
            />

            {/* 대화 히스토리 */}
            {userMessages.map((userMsg, idx) => (
              <div key={idx}>
                <MessageItem
                  messages={{ content: userMsg }}
                  isMine={true}
                  userName={data?.my_name}
                  isPreview={true}
                />
                {aiResponses[idx] && (
                  <MessageItem
                    messages={{
                      content: aiResponses[idx].content || "...",
                      visualAction: data?.visual_action,
                    }}
                    isMine={false}
                    aiName={data?.ai_name}
                    isPreview={true}
                    hiddenMeaning={aiResponses[idx].hiddenMeaning}
                    isRevealed={aiResponses[idx].isRevealed}
                    onToggleReveal={() => toggleReveal(idx)}
                    showsituation={showSituation}
                  />
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {/* 하단 고정 영역 */}
      <div className="px-5 pb-5 flex flex-col gap-2 backdrop-blur-md">
        {showHintPanel && hintData && (
          <div className="flex flex-col gap-2">
            {hintData.hints.map((h, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-gray-100 px-4 py-3 shadow-sm"
              >
                <p className="text-sm text-gray-700">{h}</p>
              </div>
            ))}
          </div>
        )}

        {/* 남은 턴수 */}
        <div className="text-white px-5 py-2.5 flex gap-2.5 items-center justify-center bg-gray-800/50 rounded-xl">
          <InfoIcon />
          <span className="text-sm">
            They`re waiting for your reply! ({aiResponses.length}/2)
          </span>
        </div>
        <ChatInput
          message={micState === "recorded" ? sttText : message}
          setMessage={setMessage}
          onSend={micState === "recorded" ? handleSendAudio : handleSend}
          onHintClick={handleHint}
          onSituationClick={handleSituation}
          onMicClick={handleMicClick}
          showHint={true}
          showSituation={true}
          isHintActive={showHintPanel}
          isSituationActive={showSituation}
          micState={micState}
        />
      </div>
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
      />
    </div>
  );
}
