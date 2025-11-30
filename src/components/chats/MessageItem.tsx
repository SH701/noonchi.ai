/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { useAuthStore } from "@/store/auth";
import { MyAI } from "@/types/persona";

type MessageItemProps = {
  m: any;
  myAI: MyAI | null;
  isMine: boolean;
  isFeedbackOpen: boolean;
  feedbackOpenId: string | null;

  handleFeedbacks: (messageId: string) => void;

  messageStatus?: "default" | "error";
};

export default function MessageItem({
  m,
  myAI,
  isMine,
  isFeedbackOpen,
  handleFeedbacks,
  messageStatus = "default",
}: MessageItemProps) {
  const [translated, setTranslated] = useState<string | null>(null);
  const [loadingTranslate, setLoadingTranslate] = useState<
    Record<string, boolean>
  >({});
  const [loadingTTS, setLoadingTTS] = useState<Record<string, boolean>>({});
  const [loadingFeedbacks, setLoadingFeedbacks] = useState<
    Record<string, boolean>
  >({});

  const accessToken = useAuthStore((s) => s.accessToken);

  const showFeedbackButton =
    isMine &&
    (m.politenessScore ?? -1) >= 0 &&
    (m.naturalnessScore ?? -1) >= 0 &&
    (m.politenessScore + m.naturalnessScore) / 2 <= 80;

  const isErrorOrFeedback =
    messageStatus === "error" ||
    (showFeedbackButton && m.feedback) ||
    showFeedbackButton;
  const handleFeedbackClick = async () => {
    setLoadingFeedbacks((prev) => ({ ...prev, [m.messageId]: true }));
    await handleFeedbacks(m.messageId);
    setLoadingFeedbacks((prev) => ({ ...prev, [m.messageId]: false }));
  };
  const bubbleClass = clsx(
    "relative z-30 p-3 sm:p-4 rounded-2xl border shadow-sm w-full",

    isMine
      ? isErrorOrFeedback
        ? "bg-rose-100 text-black border-red-500"
        : "bg-blue-500 text-white border border-transparent"
      : "bg-white text-black border-gray-200"
  );

  const handleTTsClick = async (messageId: string) => {
    setLoadingTTS((prev) => ({ ...prev, [messageId]: true }));
    try {
      const res = await fetch(`/api/messages/${messageId}/tts`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) return;
      const audioUrl = await res.text();
      const audio = new Audio(audioUrl);
      audio.play();
    } finally {
      setLoadingTTS((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  const handleTranslateClick = async (messageId: string) => {
    setLoadingTranslate((prev) => ({ ...prev, [messageId]: true }));
    try {
      if (translated) {
        setTranslated(null);
        return;
      }
      const res = await fetch(`/api/messages/${messageId}/translate`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) return;
      const text = await res.text();
      setTranslated(text);
    } finally {
      setLoadingTranslate((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  return (
    <div
      className={clsx(
        "flex mb-4 gap-2",
        isMine ? "justify-end " : "justify-start flex flex-col"
      )}
    >
      {!isMine && (
        <div className=" flex flex-row gap-2 mb-1">
          <div className="w-6 h-6 rounded-full n  bg-gray-300"></div>
          <p className="text-sm font-medium text-gray-600">
            {myAI?.name ?? "AI"}
          </p>
        </div>
      )}

      {/* 메시지 텍스트 + 부가 박스 */}
      <div className={clsx("max-w-[75%]", isMine && "ml-auto")}>
        {/* 메시지 박스 */}
        <div className="relative flex items-center justify-center gap-3">
          {showFeedbackButton && (
            <button
              onClick={handleFeedbackClick}
              disabled={loadingFeedbacks[m.messageId]}
              className="w-[18px] h-[18px] border-2 border-red-500 rounded-full 
       flex items-center justify-center shadow-sm shrink-0 
       bg-transparent  cursor-pointer"
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
                <span className="text-red-500 text-xs font-bold leading-none">
                  i
                </span>
              )}
            </button>
          )}
          {/* 말풍선 박스 */}
          <div className={bubbleClass}>
            <p className="text-sm leading-[130%] whitespace-pre-wrap my-1">
              {m.content}
            </p>

            {/* 번역/tts 버튼 (AI 메시지) */}
            {!isMine && (
              <div className="flex gap-2 mt-2 pt-2 border-t border-gray-200">
                <button
                  onClick={() => handleTTsClick(m.messageId)}
                  disabled={loadingTTS[m.messageId]}
                >
                  <Image
                    src="/etc/volume_up.svg"
                    width={20}
                    height={20}
                    alt="TTS"
                  />
                </button>

                <button
                  onClick={() => handleTranslateClick(m.messageId)}
                  disabled={loadingTranslate[m.messageId]}
                >
                  <Image
                    src="/etc/language.svg"
                    width={20}
                    height={20}
                    alt="Translate"
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 피드백 박스 */}
        {isMine && isFeedbackOpen && m.feedback && (
          <div className="p-4 bg-gray-600 rounded-xl shadow-sm -mt-5 pt-6 transform translate-x-[30px] mr-7.5">
            <div className="text-white text-sm pb-2 border-b border-gray-500">
              {m.feedback.appropriateExpression}
            </div>
            <div className="text-gray-300 text-sm mt-2">
              {m.feedback.explain}
            </div>
          </div>
        )}

        {translated && (
          <div className="px-3 pb-3 pt-6 bg-gray-600 rounded-xl shadow-sm mt-2">
            <p className="text-gray-100 text-sm">{translated}</p>
          </div>
        )}
      </div>
    </div>
  );
}
