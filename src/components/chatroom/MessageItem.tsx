"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { MyAI } from "@/types/etc/persona.type";
import { ChatMsg } from "@/types/messages/messages.type";
import { RotateCcw, Volume2 } from "lucide-react";

import {
  useMessageFeedback,
  useMessageTTS,
  useMessageTranslate,
} from "@/hooks/mutations/messages/useMessageFeedback";
import NotTTS from "../modal/NotTTS";
import { Spinner } from "../ui/spinner/spinner";
import { ChatLoading } from "../common";
import { InfoIcon } from "@/assets/svgr";

type MessageItemProps = {
  messages: Pick<ChatMsg, "content"> & Partial<ChatMsg>;
  myAI?: MyAI | null;
  isMine?: boolean;
  isFirstAIMessage?: boolean;
  isPending?: boolean;
  showsituation?: boolean;
  isPreview?: boolean;
  aiName?: string;
  userName?: string;
  hiddenMeaning?: string;
  isRevealed?: boolean;
  onToggleReveal?: () => void;
};

export default function MessageItem({
  messages,
  myAI,
  isMine,
  showsituation,
  isPreview = false,
  aiName,
  userName,
  hiddenMeaning,
  isRevealed,
  onToggleReveal,
}: MessageItemProps) {
  const [translateOpen, setTranslateOpen] = useState(false);
  const [ttsOpen, setTtsOpen] = useState(false);
  const [meanOpen, setMeanOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const {
    data: translateText,
    mutate: translate,
    isPending: loadingTranslate,
  } = useMessageTranslate();
  const { mutate: tts, isPending: loadingTTS } = useMessageTTS();
  const { data: feedbackData } = useMessageFeedback(
    feedbackOpen ? String(messages.messageId) : undefined,
  );

  const handleFeedback = () => {
    setFeedbackOpen((prev) => !prev);
  };
  const handleTTsClick = (messageId: string) => {
    if (!messageId) return;
    tts(messageId, {
      onError: () => setTtsOpen(true),
    });
  };

  const handleTranslateClick = (messageId: string) => {
    if (!messageId) return;
    if (!translateOpen) {
      translate(messageId);
    }
    setTranslateOpen((prev) => !prev);
  };
  const handleHiddenMean = () => {
    setMeanOpen((prev) => !prev);
  };

  if (messages.isLoading && !isMine) {
    return <ChatLoading />;
  }
  return (
    <div
      className={clsx(
        "flex mb-4 gap-2",
        isMine ? " justify-end" : "justify-start flex flex-col",
      )}
    >
      {!isMine && (
        <div className=" flex flex-row gap-2 mb-1">
          <div className="flex items-center justify-center bg-gray-300 p-2 rounded-full">
            <span>{(aiName ?? myAI?.aiRole ?? "A")[0]}</span>
          </div>
          <p className="text-sm font-medium text-gray-600">
            {aiName ?? myAI?.name ?? "AI"}
          </p>
        </div>
      )}

      {/* 메시지 박스 */}
      <div className="w-61">
        {/* 유저 말풍선 박스 */}
        {isMine && (
          <div className="flex flex-col gap-1">
            <p className="text-end">{userName ?? myAI?.userRole}</p>
            <div className="p-4 bg-white rounded-b-xl rounded-tl-xl">
              {showsituation && messages.visualAction && (
                <div className="mb-2 p-3 bg-blue-50 border border-blue-100 rounded-lg shadow-sm animate-in fade-in duration-300">
                  <p className="text-sm text-blue-800 italic">
                    {messages.visualAction}
                  </p>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap my-1 ">
                {messages.content}
              </p>
              <div className="pt-2.5 border-t border-gray-200 flex justify-between">
                <button
                  className="flex rounded-full border border-blue-500 px-2 py-1 gap-1"
                  onClick={handleFeedback}
                >
                  <InfoIcon />
                  <span className="text-blue-500 text-sm">View feedback</span>
                </button>
                <RotateCcw size={20} />
              </div>
              {feedbackOpen && <span>{feedbackData?.nuanceFeedback}</span>}
            </div>
          </div>
        )}

        {/* AI 말풍선 */}
        {!isMine && (
          <div className="flex flex-col gap-2 rounded-xl p-4 border border-gray-300 bg-white">
            {showsituation && messages.visualAction && (
              <div className="mb-2 p-3 bg-blue-50 border border-blue-100 rounded-lg shadow-sm animate-in fade-in duration-300">
                <p className="text-sm text-blue-800 italic">
                  {messages.visualAction}
                </p>
              </div>
            )}
            <p className="text-sm leading-[130%] whitespace-pre-wrap my-1">
              {messages.content}
            </p>

            <div className="flex mt-2 pt-2 justify-between border-t border-gray-200">
              <div className="flex gap-2 ">
                <button
                  onClick={() => handleTTsClick(String(messages.messageId))}
                  disabled={loadingTTS}
                >
                  <Volume2 size={20} />
                </button>

                <button
                  onClick={() =>
                    handleTranslateClick(String(messages.messageId))
                  }
                  disabled={loadingTranslate}
                >
                  {loadingTranslate ? (
                    <Spinner size="20px" />
                  ) : (
                    <Image
                      src="/message/language.svg"
                      width={20}
                      height={20}
                      alt="Translate"
                    />
                  )}
                </button>
              </div>

              <button
                className="border-gradient-primary rounded-full px-2 py-1"
                onClick={isPreview ? onToggleReveal : handleHiddenMean}
              >
                👀{" "}
                <span className="text-gradient-primary text-xs font-semibold">
                  Really mean
                </span>
              </button>
            </div>
            {!isPreview && translateText && translateOpen && (
              <span>{translateText}</span>
            )}
            {isPreview
              ? isRevealed &&
                hiddenMeaning && (
                  <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 mt-1">
                    {hiddenMeaning}
                  </p>
                )
              : messages.hiddenMeaning &&
                meanOpen && <span>{messages.hiddenMeaning}</span>}
          </div>
        )}
      </div>
      {!isPreview && (
        <NotTTS isOpen={ttsOpen} onClose={() => setTtsOpen(false)} />
      )}
    </div>
  );
}
