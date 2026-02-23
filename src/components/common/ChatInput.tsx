"use client";

import { useRef, useEffect } from "react";
import { MicIcon, SendIcon } from "@/assets/svgr";
import { Asterisk, Lightbulb } from "lucide-react";

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
}: ChatInputProps) {
  const textRef = useRef<HTMLTextAreaElement>(null);

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
          <div className="flex gap-1">
            
              <button
                onClick={onMicClick}
                className="shrink-0 hover:bg-gray-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MicIcon className="size-7" />
              </button>
            
            <button
              onClick={onSend}
              className="flex items-center justify-center shrink-0 hover:bg-gray-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-blue-100"
              disabled={disabled || !message.trim()}
            >
              <SendIcon className=" text-blue-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
