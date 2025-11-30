/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { useRecorder } from "@/hooks/useRecorder";
import { useAuthStore } from "@/store/auth";

import { useMessages } from "@/hooks/chat/useMessage";
import { useConversationDetail } from "@/hooks/chat/useConversationDetail";

import MessageList from "@/components/chats/MessageList";

import { ChatMsg } from "@/types/chatmessage";
import Loading from "./loading";
import ChatroomHeader from "@/components/ui/header/ChatroomHeader";
import ChatroomInput from "@/components/chats/ChatRoomInput.";
import clsx from "clsx";
import { useMessageFeedback } from "@/hooks/useMessageFeedback";

type MicState = "idle" | "recording" | "recorded";

export default function ChatroomPage() {
  const { id } = useParams<{ id: string }>();

  const accessToken = useAuthStore((s) => s.accessToken);
  const canCall = Boolean(accessToken && id);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [feedbackOpenId, setFeedbackOpenId] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [pendingAudioFile, setPendingAudioFile] = useState<Blob | null>(null);
  const [pendingAudioUrl, setPendingAudioUrl] = useState<string | null>(null);
  const [showVoiceError, setShowVoiceError] = useState(false);
  const [micState, setMicState] = useState<MicState>("idle");

  const bottomRef = useRef<HTMLDivElement>(null);
  const { startRecording, stopRecording } = useRecorder();

  const {
    data: conversation,
    isLoading: isConversationLoading,
    error: conversationError,
  } = useConversationDetail(id);

  const conversationId = conversation?.conversationId ?? 0;
  const myAI = conversation?.aiPersona ?? null;

  const { mutate: createFeedback } = useMessageFeedback(
    conversationId,
    accessToken
  );
  const {
    data: initialMessages = "",
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

  const showVoiceErrorMessage = () => {
    setShowVoiceError(true);
    setTimeout(() => {
      setShowVoiceError(false);
    }, 3000);
  };

  const sendMessage = async (content?: string, audioUrl?: string) => {
    if (!canCall || loading || !conversationId) return;
    if ((!content || !content.trim()) && !audioUrl) return;

    const displayContent = content ?? (audioUrl ? "[Voice message]" : "");

    const optimistic: ChatMsg = {
      messageId: String(Date.now()),
      conversationId,
      type: "USER",
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
        const errorText = await userRes.text();
        console.error("❌ 409 Conflict 상세:", errorText);

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {}
        if (
          errorData?.message?.includes("STT") ||
          errorData?.message?.includes("empty text")
        ) {
          alert("음성을 인식할 수 없습니다. 더 크고 명확하게 말씀해주세요.");
        } else {
          alert(
            `메시지 전송 실패: ${
              errorData?.message || errorData?.error || "충돌이 발생했습니다"
            }`
          );
        }

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
                  messageId: userMsgData.messageId,
                  type: "USER",
                  content:
                    !userMsgData.content ||
                    (!userMsgData.content.trim() && audioUrl)
                      ? "[Voice message]"
                      : userMsgData.content ?? displayContent,
                  translatedContent: userMsgData.translatedContent ?? "",
                  audioUrl: userMsgData.audioUrl ?? null,
                  politenessScore: userMsgData.politenessScore ?? -1,
                  naturalnessScore: userMsgData.naturalnessScore ?? -1,
                  pronunciationScore: userMsgData.pronunciationScore ?? -1,
                }
              : msg
          )
        );
      }

      const aiLoadingMsg: ChatMsg = {
        messageId: String(Date.now()),
        conversationId,
        type: "AI",
        content: "AI가 대화를 생각하고 있어요..",
        translatedContent: "",
        audioUrl: null,
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
        const errorText = await aiRes.text();
        console.error("❌ AI 응답 실패:", aiRes.status, errorText);

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
                  messageId: aiData.messageId ?? Date.now(),
                  conversationId,
                  type: "AI",
                  content: aiData.content,
                  translatedContent: aiData.translatedContent ?? "",
                  audioUrl: aiData.audioUrl ?? null,
                  createdAt: aiData.createdAt ?? new Date().toISOString(),
                  isLoading: false,
                }
              : msg
          )
        );
      }
    } catch (e) {
      console.error("❌ 메시지 전송 전체 에러:", e);
      setMessages((prev) =>
        prev.filter((msg) => msg.messageId !== optimistic.messageId)
      );
    } finally {
      setLoading(false);
    }
  };
  const handleFeedbacks = (messageId: string) => {
    createFeedback(messageId);
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
      setLoading(true);

      // 1. S3에 업로드만 수행
      console.log("=== 음성 파일 업로드 시작 ===");
      const presignRes = await fetch("/api/files/presigned-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          fileType: "audio/wav",
          fileExtension: "wav",
        }),
      });

      if (!presignRes.ok) {
        throw new Error("presigned-url 요청 실패");
      }

      const { url: presignedUrl } = await presignRes.json();

      await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": "audio/wav" },
        body: pendingAudioFile,
      });

      const audioUrl = presignedUrl.split("?")[0];

      console.log("=== sendMessage 호출 with audioUrl:", audioUrl);
      await sendMessage(undefined, audioUrl);

      handleResetAudio();
    } catch (e) {
      console.error("❌ handleSendAudio error:", e);
      alert("음성 메시지 전송에 실패했습니다.");
      showVoiceErrorMessage();
    } finally {
      setLoading(false);
    }
  };

  const isDataLoading = isConversationLoading || isMessagesLoading;
  const hasError = conversationError || messagesError;

  if ((isDataLoading && messages.length === 0) || !accessToken) {
    <Loading />;
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
        <ChatroomHeader
          name={myAI?.name}
          hidden={hidden}
          setHidden={setHidden}
          conversationId={id}
        />

        {/* Messages */}
        <div className={clsx("flex-1 bg-[#F9FAFB] px-4 py-4 overflow-y-auto")}>
          <MessageList
            messages={messages}
            myAI={myAI}
            feedbackOpenId={feedbackOpenId}
            handleFeedbacks={handleFeedbacks}
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

        <ChatroomInput
          isTyping={isTyping}
          micState={micState}
          message={message}
          pendingAudioUrl={pendingAudioUrl}
          showVoiceError={showVoiceError}
          setIsTyping={setIsTyping}
          setMessage={setMessage}
          handleMicClick={handleMicClick}
          handleResetAudio={handleResetAudio}
          handleSendAudio={handleSendAudio}
          sendMessage={sendMessage}
        />
      </div>
    </>
  );
}
