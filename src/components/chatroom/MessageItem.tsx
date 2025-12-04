/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";
import { useAuthStore } from "@/store/useAuth";
import { MyAI } from "@/types/persona";
import { Info, User } from "lucide-react";
import { BotMessageSquare } from "lucide-react";
import { LightBulbIcon } from "@heroicons/react/24/solid";

type MessageItemProps = {
  m: any;
  myAI: MyAI | null;
  isMine: boolean;
  isFeedbackOpen: boolean;
  feedbackOpenId: string | null;
  handleFeedbacks: (messageId: string) => void;
  messageStatus?: "default" | "error";
  isFirstAIMessage?: boolean;
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
  const [open, setOpen] = useState(false);
  const [loadingTTS, setLoadingTTS] = useState<Record<string, boolean>>({});
  const [loadingFeedbacks, setLoadingFeedbacks] = useState<
    Record<string, boolean>
  >({});
  const [recommandtion, setRecommandtion] = useState(false);
  const [activeTab, setActiveTab] = useState("nuance");
  const [recommendation, setRecommendation] = useState(true);
  const accessToken = useAuthStore((s) => s.accessToken);

  const showFeedbackButton =
    isMine &&
    (m.politenessScore ?? -1) >= 0 &&
    (m.naturalnessScore ?? -1) >= 0 &&
    (m.politenessScore + m.naturalnessScore) / 2 <= 70;
  const avgScore = ((m.politenessScore ?? 0) + (m.naturalnessScore ?? 0)) / 2;

  const isErrorOrFeedback =
    messageStatus === "error" ||
    (showFeedbackButton && m.feedback) ||
    showFeedbackButton;

  const handleFeedbackClick = async () => {
    setLoadingFeedbacks((prev) => ({ ...prev, [m.messageId]: true }));
    await handleFeedbacks(m.messageId);
    setLoadingFeedbacks((prev) => ({ ...prev, [m.messageId]: false }));
  };

  let scoreLabel = "None";
  let scoreColor = "text-green-500";
  let scoreIcon = "/chatroom/satisfied.png";
  if (avgScore < 30) {
    scoreLabel = "Serious";
    scoreColor = "text-red-500";
    scoreIcon = "/chatroom/dissatisfied.png";
  } else if (avgScore < 70) {
    scoreLabel = "Mild";
    scoreColor = "text-yellow-500";
    scoreIcon = "/chatroom/neutral.png";
  }

  const bubbleClass = clsx(
    "relative z-30 p-4 rounded-2xl border  w-full",
    isMine
      ? isErrorOrFeedback
        ? "bg-rose-100 text-black border-red-500"
        : "bg-blue-500 text-white border border-transparent"
      : "bg-white text-black border-gray-300"
  );

  const handleTTsClick = async (messageId: string) => {
    try {
      if (!messageId) return;

      const res = await fetch(`/api/messages/${messageId}/tts`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`TTS 요청 실패: ${res.status}`);
      }

      const audioUrl = await res.text();

      const audio = new Audio(audioUrl);
      audio.play();

      return audioUrl;
    } catch (err) {
      console.error("handleTTS error:", err);
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

  const handleReactionReason = () => {
    setOpen((prev) => !prev);
  };
  const handlerecommendation = () => {
    setRecommandtion((prev) => !prev);
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
          <User className="w-6 h-6 rounded-full  bg-gray-300 text-white" />
          <p className="text-sm font-medium text-gray-600">
            {myAI?.name ?? "AI"}
          </p>
        </div>
      )}

      {/* 메시지 텍스트 + 부가 박스 */}
      <div className={clsx("max-w-[75%]", isMine && "ml-auto")}>
        {/* 메시지 박스 */}
        <div className="relative flex items-cetner justify-center gap-3">
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
                <Info className="text-red-500 size-4"></Info>
              )}
            </button>
          )}

          {/* 유저 말풍선 박스 */}
          {isMine && (
            <div className="flex flex-col w-full">
              <div className={bubbleClass}>
                <p className="text-sm leading-[130%] whitespace-pre-wrap my-1 ">
                  {m.content}
                </p>
              </div>
              <div
                className={`flex items-center justify-end mt-1 ${scoreColor}`}
              >
                <Image src={scoreIcon} alt="아이콘" width={16} height={16} />
                <span className="text-xs font-semibold">{scoreLabel}</span>
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
                    onClick={() => handleTTsClick(m.messageId)}
                    disabled={loadingTTS[m.messageId]}
                  >
                    <Image
                      src="/message/volume_up.svg"
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
                      src="/message/language.svg"
                      width={20}
                      height={20}
                      alt="Translate"
                    />
                  </button>
                </div>
                <Image
                  src="/message/ai.png"
                  width={20}
                  height={20}
                  alt="Translate"
                  className="size-5 text-gray-600"
                  onClick={() => handleReactionReason()}
                />
              </div>
            </div>
          )}
        </div>

        {/* 피드백 박스 */}
        <div className="w-full z-50 translate-x-[30px] max-w-[88%]">
          {isMine && isFeedbackOpen && m.feedback && (
            <div className="p-4 bg-gray-600 rounded-xl -mt-10 ">
              <div className="text-white text-sm pb-3 border-b border-gray-500 mb-3 pt-4">
                {m.feedback.appropriateExpression}
              </div>

              <div className="text-gray-300 text-sm mb-4">
                {activeTab === "contents"
                  ? m.feedback.contentsFeedback
                  : m.feedback.nuanceFeedback}
              </div>

              <div className="flex gap-0 justify-end">
                <button
                  onClick={() => setActiveTab("contents")}
                  className={`px-3 py-1 text-xs font-medium transition-colors rounded-l-full ${
                    activeTab === "contents"
                      ? "bg-white text-gray-800"
                      : "bg-gray-500 text-gray-300 hover:bg-gray-400"
                  }`}
                >
                  Contents
                </button>
                <button
                  onClick={() => setActiveTab("nuance")}
                  className={`px-3 py-1 text-xs font-medium transition-colors rounded-r-full ${
                    activeTab === "nuance"
                      ? "bg-white text-gray-800"
                      : "bg-gray-500 text-gray-300 hover:bg-gray-400"
                  }`}
                >
                  Nuance
                </button>
              </div>
            </div>
          )}
        </div>
        {open && (
          <div className="px-3 pb-3 pt-6 bg-gray-600 rounded-xl  -mt-5">
            <p className="text-gray-100 text-sm">{m.reactionReason}</p>
          </div>
        )}
        {translated && (
          <div className="px-3 pb-3 pt-6 bg-gray-600 rounded-xl  -mt-5">
            <p className="text-gray-100 text-sm">{translated}</p>
          </div>
        )}
      </div>
      {recommendation && !isMine && (
        <div className="max-w-[75%] ml-auto">
          <div className="relative mb-4">
            <div className="border-2 border-dashed border-gray-400 rounded-lg p-4 bg-white flex items-center justify-between gap-2">
              <p className="text-gray-500 text-sm">Recommendation</p>
              <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center border-dotted">
                <LightBulbIcon
                  className="size-4"
                  onClick={() => handlerecommendation()}
                />
              </div>
            </div>
          </div>
          {recommandtion && (
            <div className="border-2 border-dashed border-gray-400 rounded-lg p-4 bg-white flex items-start justify-between gap-2 flex-col">
              <p className="text-gray-500 text-sm wrap-break-word">
                {m.recommendation}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleTTsClick(m.messageId)}
                  disabled={loadingTTS[m.messageId]}
                >
                  <Image
                    src="/message/volume_up.svg"
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
                    src="/message/language.svg"
                    width={20}
                    height={20}
                    alt="Translate"
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
