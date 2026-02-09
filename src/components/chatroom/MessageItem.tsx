/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { MyAI } from "@/types/etc/persona.type";
import { RotateCcw, User, Volume2 } from "lucide-react";

import {
  useMessageTTS,
  useMessageTranslate,
} from "@/hooks/mutations/messages/useMessageFeedback";
import NotTTS from "../modal/NotTTS";

import { usePathname } from "next/navigation";
import { useRoleplayHint } from "@/hooks/queries/useRoleplayHint";

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
  const [open, setOpen] = useState(false);
  const [ttsOpen, setTtsOpen] = useState(false);
  const [showHintPanel, setShowHintPanel] = useState(false);
  const {
    data: translateText,
    mutate: translate,
    isPending: loadingTranslate,
  } = useMessageTranslate();
  const { mutate: tts, isPending: loadingTTS } = useMessageTTS();
  const pathname = usePathname();
  const roomId = pathname.split("/").pop();
  const { data: hintData } = useRoleplayHint(Number(roomId));
  const handleTTsClick = (messageId: string) => {
    if (!messageId) return;
    tts(messageId, {
      onError: () => setTtsOpen(true),
    });
  };

  const handleTranslateClick = (messageId: string) => {
    if (!messageId) return;
    setOpen((prev) => !prev);
    if (open) {
      translate(messageId);
    }
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
            {translateText && open && <span>{translateText}</span>}
          </div>
        )}
      </div>
      <NotTTS isOpen={ttsOpen} onClose={() => setTtsOpen(false)} />
      {showHintPanel && hintData && (
        <div className="fixed bottom-34 left-5 right-5 z-50 flex flex-col gap-2">
          <div className="rounded-2xl bg-gray-100 px-4 py-3 shadow-sm">
            <p className="text-sm text-gray-700">{hintData}</p>
          </div>
        </div>
      )}
    </div>
  );
}
