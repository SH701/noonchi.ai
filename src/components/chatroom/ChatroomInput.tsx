/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

interface ChatroomInputProps {
  isTyping: boolean;
  micState: "idle" | "recording" | "recorded";
  message: string;
  pendingAudioUrl: string | null;
  showVoiceError: boolean;
  isAIResponding?: boolean; // ✅ 추가

  setIsTyping: (v: boolean) => void;
  setMessage: (v: string) => void;

  handleMicClick: () => void;
  handleResetAudio: () => void;
  handleSendAudio: () => void;
  sendMessage: (content: string) => void;
}

export default function ChatroomInput({
  isTyping,
  micState,
  message,
  showVoiceError,
  isAIResponding = false,

  setIsTyping,
  setMessage,

  handleMicClick,
  handleResetAudio,
  handleSendAudio,
  sendMessage,
}: ChatroomInputProps) {
  return (
    <>
      <AnimatePresence>
        {showVoiceError && (
          <motion.div
            key="voice-error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed bottom-[174px] left-1/2 -translate-x-1/2 -translate-y-3 z-40 flex flex-col items-center"
          >
            <Image
              src="/etc/voice_error.png"
              alt="Voice Error"
              width={150}
              height={60}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={clsx(
          isTyping ? "h-[136px]" : "h-[174px]",
          "border-t border-gray-200 md:max-w-[375px] w-full flex justify-center items-center flex-col gap-6 absoulte bottom-0 z-50"
        )}
      >
        {isTyping ? (
          ""
        ) : (
          <input
            type="text"
            className="rounded-[100px] px-5 py-2 w-[334px] bg-gray-100 "
            placeholder={
              isAIResponding ? "AI is responding..." : "Press the voice button."
            }
            disabled
          />
        )}
        <div className="flex gap-8 items-center justify-center">
          {!isTyping && (
            <>
              {micState === "recording" || micState === "recorded" ? (
                <button
                  className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100"
                  onClick={handleResetAudio}
                  disabled={isAIResponding}
                >
                  <Image
                    src="/chatroom/cancel.png"
                    alt="Refresh"
                    width={64}
                    height={64}
                    className={isAIResponding ? "opacity-50" : ""}
                  />
                </button>
              ) : (
                <div className="w-12 h-12" />
              )}

              {micState === "idle" && (
                <button onClick={handleMicClick} disabled={isAIResponding}>
                  <Image
                    src="/chatroom/voice.png"
                    alt="Mic"
                    width={82}
                    height={82}
                    className={isAIResponding ? "opacity-50" : ""}
                  />
                </button>
              )}

              {micState === "recording" && (
                <button onClick={handleMicClick} disabled={isAIResponding}>
                  <Image
                    src="/chatroom/voicesave.png"
                    alt="Pause"
                    width={82}
                    height={82}
                    className={isAIResponding ? "opacity-50" : ""}
                  />
                </button>
              )}

              {micState === "recorded" && (
                <button onClick={handleSendAudio} disabled={isAIResponding}>
                  <Image
                    src="/chatroom/send.png"
                    alt="Send"
                    width={82}
                    height={82}
                    className={isAIResponding ? "opacity-50" : ""}
                  />
                </button>
              )}

              <button
                className="bg-white rounded-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                onClick={() => setIsTyping(true)}
                disabled={isAIResponding}
              >
                <Image
                  src="/chatroom/bluekeyboard.png"
                  alt="Keyboard"
                  width={56}
                  height={56}
                />
              </button>
            </>
          )}

          {isTyping && (
            <div className="flex items-center w-full max-w-[334px] min-w-0 border border-blue-300 rounded-full bg-white mx-4">
              <button
                onClick={() => setIsTyping(false)}
                className="p-2 shrink-0 disabled:opacity-50"
                disabled={isAIResponding}
              >
                <Image
                  src="/chatroom/mic.png"
                  alt="Mic"
                  width={24}
                  height={24}
                />
              </button>

              <input
                type="text"
                placeholder={
                  isAIResponding ? "AI is responding..." : "Type your answer..."
                }
                className="grow min-w-0 p-2 text-gray-500 placeholder-gray-400 border-none outline-none disabled:bg-gray-50"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  !isAIResponding &&
                  message.trim() &&
                  sendMessage(message)
                }
                disabled={isAIResponding}
              />

              <button
                onClick={() => sendMessage(message)}
                className="shrink-0 p-3 hover:bg-gray-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isAIResponding || !message.trim()}
              >
                <Image
                  src="/chatroom/up.png"
                  alt="Send"
                  width={28}
                  height={28}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
