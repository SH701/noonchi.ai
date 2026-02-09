/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { MyAI } from "@/types/etc/persona.type";
import { RotateCcw, Volume2 } from "lucide-react";

import {
  useMessageFeedback,
  useMessageTTS,
  useMessageTranslate,
} from "@/hooks/mutations/messages/useMessageFeedback";
import NotTTS from "../modal/NotTTS";
import { Spinner } from "../ui/spinner";

type MessageItemProps = {
  m: any;
  myAI: MyAI | null;
  isMine: boolean;

  isFirstAIMessage?: boolean;
  isPending?: boolean;
  showsituation?: boolean;
};

export default function MessageItem({
  m,
  myAI,
  isMine,

  showsituation,
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
  const { data: feedbackData, isLoading } = useMessageFeedback(
    feedbackOpen ? String(m.messageId) : undefined,
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

  if (m.isLoading && !isMine) {
    return (
      <div className="flex mb-4 gap-2 justify-start">
        <div className="max-w-[75%]">
          <div className="flex flex-col gap-2 rounded-xl p-4 border border-gray-300 bg-gray-100">
            <div className="flex items-center gap-2">
              <span className="typing-dot animate-pulse w-2 h-2 bg-gray-500 rounded-full"></span>
              <span className="typing-dot animate-pulse w-2 h-2 bg-gray-500 rounded-full delay-150"></span>
              <span className="typing-dot animate-pulse w-2 h-2 bg-gray-500 rounded-full delay-300"></span>
            </div>
          </div>
        </div>
      </div>
    );
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
            <span>{myAI?.aiRole[0]}</span>
          </div>
          <p className="text-sm font-medium text-gray-600">
            {myAI?.name ?? "AI"}
          </p>
        </div>
      )}

      {/* 메시지 박스 */}
      <div className="w-61">
        {/* 유저 말풍선 박스 */}
        {isMine && (
          <div className="flex flex-col gap-1">
            <p className="text-end">{myAI?.userRole}</p>
            <div className="p-4 bg-white rounded-b-xl rounded-tl-xl">
              {showsituation && m.visualAction && (
                <div className="mb-2 p-3 bg-blue-50 border border-blue-100 rounded-lg shadow-sm animate-in fade-in duration-300">
                  <p className="text-sm text-blue-800 italic">
                    {m.visualAction}
                  </p>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap my-1 ">{m.content}</p>
              <div className="pt-2.5 border-t border-gray-200 flex justify-between">
                <button
                  className="flex rounded-full border border-blue-500 px-2 py-1 gap-1"
                  onClick={handleFeedback}
                >
                  <Image
                    src="/chatroom/warning.png"
                    alt="feedback"
                    width={20}
                    height={20}
                  />
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
            {showsituation && m.visualAction && (
              <div className="mb-2 p-3 bg-blue-50 border border-blue-100 rounded-lg shadow-sm animate-in fade-in duration-300">
                <p className="text-sm text-blue-800 italic">{m.visualAction}</p>
              </div>
            )}
            <p className="text-sm leading-[130%] whitespace-pre-wrap my-1">
              {m.content}
            </p>

            <div className="flex mt-2 pt-2 justify-between border-t border-gray-200">
              <div className="flex gap-2 ">
                <button
                  onClick={() => handleTTsClick(String(m.messageId))}
                  disabled={loadingTTS}
                >
                  <Volume2 size={20} />
                </button>

                <button
                  onClick={() => handleTranslateClick(String(m.messageId))}
                  disabled={loadingTranslate}
                >
                  {loadingTranslate ? (
                    <Spinner className="size-5" />
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
                onClick={handleHiddenMean}
              >
                👀{" "}
                <span className="text-gradient-primary text-xs font-semibold">
                  Really mean
                </span>
              </button>
            </div>
            {translateText && translateOpen && <span>{translateText}</span>}
            {m.hiddenMeaning && meanOpen && <span>{m.hiddenMeaning}</span>}
          </div>
        )}
      </div>
      <NotTTS isOpen={ttsOpen} onClose={() => setTtsOpen(false)} />
    </div>
  );
}
