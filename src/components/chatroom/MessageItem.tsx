/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { MyAI } from "@/types/etc/persona.type";
import { Info, RotateCcw, User, Volume2 } from "lucide-react";

import {
  useMessageTTS,
  useMessageTranslate,
} from "@/hooks/mutations/useMessageFeedback";

type MessageItemProps = {
  m: any;
  myAI: MyAI | null;
  isMine: boolean;
  feedbackOpenId: number | null;
  handleFeedbacks: (messageId: number) => void;
  isFirstAIMessage?: boolean;
  isPending?: boolean;
};

export default function MessageItem({
  m,
  myAI,
  isMine,
  feedbackOpenId,
  handleFeedbacks,
}: MessageItemProps) {
  const [translated, setTranslated] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState<
    Record<string, boolean>
  >({});

  const { mutate: fetchTTS, isPending: loadingTTS } = useMessageTTS();
  const { mutate: fetchTranslate, isPending: loadingTranslate } =
    useMessageTranslate();

  const showFeedbackButton =
    isMine &&
    (m.politenessScore ?? -1) >= 0 &&
    (m.naturalnessScore ?? -1) >= 0 &&
    (m.politenessScore + m.naturalnessScore) / 2 <= 80;

  const handleFeedbackClick = async () => {
    setLoadingFeedbacks((prev) => ({ ...prev, [m.messageId]: true }));
    await handleFeedbacks(m.messageId);
    setLoadingFeedbacks((prev) => ({ ...prev, [m.messageId]: false }));
  };

  const handleTTsClick = (messageId: string) => {
    if (!messageId) return;

    fetchTTS(messageId, {
      onSuccess: (audioUrl) => {
        const audio = new Audio(audioUrl);
        audio.play();
      },
      onError: (err) => {
        console.error("handleTTS error:", err);
      },
    });
  };

  const handleTranslateClick = (messageId: string) => {
    if (translated) {
      setTranslated(null);
      return;
    }

    fetchTranslate(messageId, {
      onSuccess: (text) => {
        setTranslated(text);
      },
      onError: (err) => {
        console.error("handleTranslate error:", err);
      },
    });
  };

  const handleReactionReason = () => {
    setOpen((prev) => !prev);
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
          <User className="w-6 h-6 rounded-full  bg-gray-300 text-white" />
          <p className="text-sm font-medium text-gray-600">
            {myAI?.name ?? "AI"}
          </p>
        </div>
      )}

      {/* 메시지 박스 */}
      <div className="w-61">
        {showFeedbackButton && (
          <button
            onClick={handleFeedbackClick}
            disabled={loadingFeedbacks[m.messageId]}
            className=" cursor-pointer mb-4"
          >
            {loadingFeedbacks[m.messageId] ? (
              <svg
                className="animate-spin w-3 h-3 text-gray-600"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              <Info className="text-red-500 size-4" />
            )}
          </button>
        )}

        {/* 유저 말풍선 박스 */}
        {isMine && (
          <div className="flex flex-col gap-1">
            <p className="text-end">나라고</p>
            <div className="p-4 bg-white rounded-b-xl rounded-tl-xl">
              <p className="text-sm whitespace-pre-wrap my-1 ">{m.content}</p>
              <div className="pt-2.5 border-t border-gray-200 flex justify-between">
                <button className="flex rounded-full border border-blue-500 px-2 py-1 gap-1">
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
            </div>
          </div>
        )}

        {/* AI 말풍선 */}
        {!isMine && (
          <div className="flex flex-col gap-2 rounded-xl p-4 border border-gray-300 bg-white">
            <p className="text-sm leading-[130%] whitespace-pre-wrap my-1">
              {m.reactionEmoji}
              {m.reactionDescription}
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
                  <Image
                    src="/message/language.svg"
                    width={20}
                    height={20}
                    alt="Translate"
                  />
                </button>
              </div>
              <button
                onClick={() => handleReactionReason()}
                className="border-gradient-primary rounded-full px-2 py-1"
              >
                👀{" "}
                <span className="text-gradient-primary text-xs font-semibold">
                  Really mean
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
