/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { useRecorder } from "@/hooks/useRecorder";
import { useAuthStore } from "@/store/auth";

import { ChatMsg, useMessages } from "@/hooks/chat/useMessage";
import { useConversationDetail } from "@/hooks/chat/useConversationDetail";
import { HonorificResults } from "@/components/chats/HonorificSlider";
import MessageList from "@/components/chats/MessageList";
import LoadingModal from "@/components/chats/LoadingModal";

type MicState = "idle" | "recording" | "recorded";

export default function ChatroomPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const canCall = Boolean(accessToken && id);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [feedbackOpenId, setFeedbackOpenId] = useState<string | null>(null);
  const [honorificResults, setHonorificResults] = useState<
    Record<string, HonorificResults>
  >({});
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
  const [hidden, setHidden] = useState(false);
  const [endModalOpen, setEndModalOpen] = useState(false);
  const [loadingModalOpen, setLoadingModalOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [pendingAudioFile, setPendingAudioFile] = useState<Blob | null>(null);
  const [pendingAudioUrl, setPendingAudioUrl] = useState<string | null>(null);
  const [showVoiceError, setShowVoiceError] = useState(false);
  const [micState, setMicState] = useState<MicState>("idle");

  const bottomRef = useRef<HTMLDivElement>(null);
  const { isRecording, startRecording, stopRecording } = useRecorder();

  const {
    data: conversation,
    isLoading: isConversationLoading,
    error: conversationError,
  } = useConversationDetail(id);

  const conversationId = conversation?.conversationId ?? null;
  const myAI = conversation?.aiPersona ?? null;

  const {
    data: initialMessages = [],
    isLoading: isMessagesLoading,
    error: messagesError,
  } = useMessages(id);

  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyboardClick = () => {
    setIsTyping((prev) => !prev);
  };

  const showVoiceErrorMessage = () => {
    setShowVoiceError(true);
    setTimeout(() => {
      setShowVoiceError(false);
    }, 3000);
  };

  const sendMessage = async (content?: string, audioUrl?: string) => {
    if (!canCall || loading || !conversationId) return;
    if ((!content || !content.trim()) && !audioUrl) return;

    const displayContent = content ?? "";

    const optimistic: ChatMsg = {
      messageId: `user_${Date.now()}`,
      conversationId,
      role: "USER",
      content: displayContent,
      createdAt: new Date().toISOString(),
      politenessScore: -1,
      naturalnessScore: -1,
    };

    setMessages((prev) => [...prev, optimistic]);
    setMessage("");
    setLoading(true);

    try {
      const userRes = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          conversationId,
          content: content ?? "",
          audioUrl,
        }),
      });

      if (userRes.status === 409) {
        if (audioUrl) {
          showVoiceErrorMessage();
        }
        setMessages((prev) =>
          prev.filter((msg) => msg.messageId !== optimistic.messageId)
        );
        return;
      }

      if (!userRes.ok) {
        setMessages((prev) =>
          prev.filter((msg) => msg.messageId !== optimistic.messageId)
        );
        return;
      }

      const userMsgData = await userRes.json();

      if (userMsgData?.messageId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.messageId === optimistic.messageId
              ? {
                  ...msg,
                  messageId: String(userMsgData.messageId),
                  content:
                    !userMsgData.content ||
                    (!userMsgData.content.trim() && audioUrl)
                      ? "[Voice message]"
                      : userMsgData.content || displayContent,
                  politenessScore: userMsgData.politenessScore ?? -1,
                  naturalnessScore: userMsgData.naturalnessScore ?? -1,
                }
              : msg
          )
        );
      }

      const aiLoadingMsg: ChatMsg = {
        messageId: `ai_loading_${Date.now()}`,
        conversationId,
        role: "AI",
        content: "...",
        createdAt: new Date().toISOString(),
        isLoading: true,
      };
      setMessages((prev) => [...prev, aiLoadingMsg]);

      const aiRes = await fetch(
        `/api/messages/ai-reply?conversationId=${conversationId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!aiRes.ok) {
        setMessages((prev) =>
          prev.filter((msg) => msg.messageId !== aiLoadingMsg.messageId)
        );
        return;
      }

      const aiData = await aiRes.json();

      if (aiData?.content?.trim()) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.messageId === aiLoadingMsg.messageId
              ? {
                  messageId: String(aiData.messageId ?? `ai_${Date.now()}`),
                  conversationId,
                  role: "AI",
                  content: aiData.content,
                  createdAt: aiData.createdAt ?? new Date().toISOString(),
                  isLoading: false,
                }
              : msg
          )
        );
      }
    } catch (e) {
      setMessages((prev) =>
        prev.filter((msg) => msg.messageId !== optimistic.messageId)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEnd = async () => {
    if (!conversationId) return;

    setEndModalOpen(false);
    setLoadingModalOpen(true);

    try {
      const res = await fetch(`/api/conversations/${id}/end`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        setLoadingModalOpen(false);
        return;
      }

      router.push(`/main/custom/chatroom/${id}/result`);
    } catch {
      setLoadingModalOpen(false);
    }
  };

  const handleFeedbacks = async (messageId: string) => {
    if (!accessToken) return;

    if (feedbackOpenId === messageId) {
      setFeedbackOpenId(null);
      return;
    }

    try {
      const res = await fetch(`/api/messages/${messageId}/feedback`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) return;

      const feedbackData = await res.json();

      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === messageId ? { ...msg, feedback: feedbackData } : msg
        )
      );

      setFeedbackOpenId(messageId);
    } catch (err) {}
  };

  const handleHonorific = async (messageId: string) => {
    if (!accessToken) return;

    if (honorificResults[messageId]) {
      setHonorificResults((prev) => {
        const copy = { ...prev };
        delete copy[messageId];
        return copy;
      });
      setSliderValues((prev) => {
        const copy = { ...prev };
        delete copy[messageId];
        return copy;
      });
      return;
    }

    try {
      const res = await fetch(
        `/api/messages/${messageId}/honorific-variations`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!res.ok) {
        console.error("존댓말 변환 실패");
        return;
      }

      const data = await res.json();

      setHonorificResults((prev) => ({
        ...prev,
        [messageId]: data,
      }));
      setSliderValues((prev) => ({
        ...prev,
        [messageId]: 1,
      }));
    } catch (err) {
      console.error("handleHonorific error:", err);
    }
  };

  const handleMicClick = async () => {
    if (micState === "idle") {
      startRecording();
      setMicState("recording");
    } else if (micState === "recording") {
      const file = await stopRecording();
      setPendingAudioFile(file);
      setPendingAudioUrl(URL.createObjectURL(file));
      setMicState("recorded");
    }
  };

  const handleResetAudio = () => {
    setPendingAudioFile(null);
    setPendingAudioUrl(null);
    setMicState("idle");
  };

  const handleSendAudio = async () => {
    if (!pendingAudioFile || !accessToken) return;
    if (!conversationId) return;

    try {
      const res = await fetch("/api/files/presigned-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          fileType: "audio.wav",
          fileExtension: "wav",
        }),
      });

      if (!res.ok) throw new Error("presigned-url 요청 실패");

      const { url: presignedUrl } = await res.json();

      await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": "audio/wav" },
        body: pendingAudioFile,
      });

      const audioUrl = presignedUrl.split("?")[0];
      await sendMessage("", audioUrl);

      handleResetAudio();
    } catch (e) {
      console.error("handleSendAudio error:", e);
      showVoiceErrorMessage();
    }
  };

  const isDataLoading = isConversationLoading || isMessagesLoading;
  const hasError = conversationError || messagesError;

  if (!accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">로그인이 필요합니다.</p>
      </div>
    );
  }

  if (isDataLoading && messages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading…</p>
      </div>
    );
  }

  if (hasError && messages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">채팅방 정보를 불러오지 못했습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col max-w-[500px] w-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
          <div className="flex items-center justify-between w-full">
            <Link
              href="/main"
              aria-label="Back"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <span className="text-lg font-semibold text-gray-900 font-pretendard">
              {myAI?.name ?? "..."}
            </span>
            <button
              onClick={() => setEndModalOpen(true)}
              aria-label="End conversation"
              className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <Image
                src="/etc/exit_to_app.svg"
                alt="exit"
                width={24}
                height={24}
              />
            </button>
          </div>

          {!hidden && (
            <button
              className="absolute right-3"
              onClick={() => setHidden(true)}
            >
              <Image src="/etc/exit2.png" alt="exit" width={84} height={33} />
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 bg-white px-4 py-4 overflow-y-auto mb-[139px]">
          <MessageList
            messages={messages}
            myAI={myAI}
            feedbackOpenId={feedbackOpenId}
            honorificResults={honorificResults}
            sliderValues={sliderValues}
            handleFeedbacks={handleFeedbacks}
            handleHonorific={handleHonorific}
            setSliderValues={setSliderValues}
          />
          <div ref={bottomRef} />
        </div>

        {/* Voice Error Toast */}
        <AnimatePresence>
          {showVoiceError && (
            <motion.div
              key="voice-error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="fixed bottom-[139px] left-1/2 -translate-x-1/2 -translate-y-3 z-40 flex flex-col items-center"
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

        {/* Input 영역 */}
        <div className="bg-blue-50 py-4 h-[139px] border-t border-gray-200 max-w-[500px] w-full flex justify-center items-center gap-8 fixed bottom-0 z-50">
          {!isTyping && (
            <>
              {micState === "recording" || micState === "recorded" ? (
                <button
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
                  onClick={handleResetAudio}
                >
                  <Image
                    src="/chatroom/refresh.png"
                    alt="Refresh"
                    width={24}
                    height={24}
                  />
                </button>
              ) : (
                <div className="w-12 h-12" />
              )}

              {micState === "idle" && (
                <button onClick={handleMicClick}>
                  <Image
                    src="/chatroom/mic.png"
                    alt="Mic"
                    width={82}
                    height={82}
                  />
                </button>
              )}
              {micState === "recording" && (
                <button onClick={handleMicClick}>
                  <Image
                    src="/chatroom/pause.png"
                    alt="Pause"
                    width={82}
                    height={82}
                  />
                </button>
              )}
              {micState === "recorded" && (
                <button onClick={handleSendAudio}>
                  <Image
                    src="/chatroom/send.png"
                    alt="Send"
                    width={82}
                    height={82}
                  />
                </button>
              )}

              <button
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
                onClick={handleKeyboardClick}
              >
                <Image
                  src="/chatroom/keyboard_alt.png"
                  alt="Keyboard"
                  width={24}
                  height={24}
                />
              </button>
            </>
          )}

          {isTyping && (
            <div className="flex items-center w-full max-w-[334px] min-w-0 border border-blue-300 rounded-full bg-white mx-4">
              <button
                onClick={handleKeyboardClick}
                className="p-2 flex-shrink-0"
              >
                <Image
                  src="/chatroom/mic.png"
                  alt="Mic"
                  width={44}
                  height={44}
                />
              </button>
              <input
                type="text"
                placeholder="Reply here"
                className="flex-grow min-w-0 p-2 text-gray-500 placeholder-gray-400 border-none outline-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(message)}
              />
              <button
                onClick={() => sendMessage(message)}
                className="flex-shrink-0 p-3 hover:bg-gray-50 rounded-full transition-colors"
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

      {endModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setEndModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 w-[320px] shadow-lg z-50 flex flex-col items-center text-center">
            <Image
              src="/etc/exitchar.svg"
              alt="exit"
              width={118}
              height={94}
              className="my-5"
            />

            <p className="text-lg font-semibold mb-2">
              Would you like to end the conversation
            </p>
            <p className="text-sm text-gray-600 mb-6">and receive feedback?</p>

            <button
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors cursor-pointer"
              onClick={handleEnd}
            >
              Get Feedback
            </button>

            <button
              className="w-full mt-2 bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold cursor-pointer"
              onClick={() => setEndModalOpen(false)}
            >
              Keep Conversation
            </button>
          </div>
        </div>
      )}

      {loadingModalOpen && <LoadingModal open={loadingModalOpen} />}
    </>
  );
}
