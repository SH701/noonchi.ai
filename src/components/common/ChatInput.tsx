"use client";

import { useRef, useEffect, useState } from "react";
import { MicIcon, SendIcon } from "@/assets/svgr";
import { Asterisk, Lightbulb } from "lucide-react";
import { MicState } from "@/hooks/useVoiceChat";

interface ChatInputProps {
  message: string;
  setMessage: (v: string) => void;
  onSend: () => void;
  onMicClick?: () => void;
  onHintClick?: () => void;
  onSituationClick?: () => void;
  disabled?: boolean;
  placeholder?: string;
  showSituation?: boolean;
  showHint?: boolean;
  isHintActive?: boolean;
  isSituationActive?: boolean;
  micState?: MicState;
}

export default function ChatInput({
  message,
  setMessage,
  onSend,
  onMicClick,
  onHintClick,
  onSituationClick,
  disabled = false,
  placeholder = "Type your answer...",
  showSituation = false,
  showHint = false,
  isHintActive = false,
  isSituationActive = false,
  micState = "idle",
}: ChatInputProps) {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = `${textRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="w-full ">
      <div className="flex flex-col items-center w-full min-w-0 rounded-[20px] bg-white px-4 py-3 ">
        <textarea
          ref={textRef}
          rows={1}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="grow min-w-0 w-full text-gray-500 placeholder-gray-400 border-none outline-none disabled:bg-gray-50 max-h-30 resize-none overflow-y-auto mb-3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !disabled &&
              message.trim()
            ) {
              e.preventDefault();
              onSend();
            }
          }}
          disabled={disabled}
        />
        <div className="flex gap-1 w-full items-end justify-between">
          <div className="flex gap-1">
            {showSituation && (
              <button
                className={`flex border rounded-full px-1 h-6.5 ${isSituationActive ? "border-amber-500 text-amber-500" : ""}`}
                onClick={onSituationClick}
              >
                <Asterisk
                  className={`py-1 ${isSituationActive ? "text-amber-500" : ""}`}
                />
                <p>situation</p>
              </button>
            )}
            {showHint && (
              <button
                onClick={onHintClick}
                className={`flex border rounded-full px-2 h-6.5 ${isHintActive ? "border-blue-500 text-blue-500" : ""}`}
              >
                <Lightbulb
                  className={`py-1 ${isHintActive ? "text-blue-500" : ""}`}
                />
                <p>needhelp</p>
              </button>
            )}
          </div>
          <div>
            {micState === "recording" ? (
              <button
                onClick={onMicClick}
                className="shrink-0 rounded-full flex items-center justify-center p-1 border border-white"
                style={{
                  background:
                    "linear-gradient(180deg, #B499FF 0%, #98AEFF 100%)",
                  boxShadow: "0 0 12px 0 #8434FF",
                }}
              >
                <MicIcon className="size-6 text-white animate-pulse" />
              </button>
            ) : isFocused || micState === "recorded" ? (
              <button
                onClick={onSend}
                className="flex items-center justify-center shrink-0  rounded-full transition-colors  bg-blue-100 p-1"
                disabled={disabled || !message.trim()}
                style={{
                  background:
                    "linear-gradient(180deg, #86C3E8 0%, #8397FF 100%)",
                }}
              >
                <SendIcon className="text-blue-600" />
              </button>
            ) : (
              <button
                onClick={onMicClick}
                className="shrink-0 rounded-full border flex items-center justify-center p-1"
              >
                <MicIcon className="size-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
