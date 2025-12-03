/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useRecorder } from "@/hooks/chatroom/useRecorder";
import { useAuthStore } from "@/store/useAuth";
import { useMessages } from "@/hooks/chatroom/useMessage";
import { useConversationDetail } from "@/hooks/conversation/useConversationDetail";
import { ChatMsg } from "@/types/chatmessage";
import Loading from "./loading";
import clsx from "clsx";
import { useMessageFeedback } from "@/hooks/chatroom/useMessageFeedback";
import { useSendMessage } from "@/hooks/chatroom/useSendMessage";
import { useAiReply } from "@/hooks/chatroom/useAiReply";
import {
  ChatroomHeader,
  ChatroomInput,
  MessageList,
} from "@/components/chatroom";
import dynamic from "next/dynamic";
const ChatroomInfo = dynamic(import("@/components/chatroom/ChatroomInfo"), {
  ssr: false,
});
type MicState = "idle" | "recording" | "recorded";

export default function ChatroomPage() {
  const { id } = useParams<{ id: string }>();

  const accessToken = useAuthStore((s) => s.accessToken);
  const [infoOpen, setInfoOpen] = useState(false);
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
  const { mutateAsync: sendUserMessage } = useSendMessage(conversationId);
  const { mutateAsync: sendAiReply } = useAiReply(conversationId);
  const { mutate: createFeedback } = useMessageFeedback(conversationId);
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
    if ((!content || !content.trim()) && !audioUrl) return;

    const tempId = "temp-user-" + Date.now();

    const optimistic: ChatMsg = {
      messageId: tempId,
      conversationId,
      type: "USER",
      content: content ?? "[Voice message]",
      translatedContent: "",
      audioUrl: audioUrl ?? null,
      createdAt: new Date().toISOString(),
      politenessScore: -1,
      naturalnessScore: -1,
      pronunciationScore: -1,
    };

    setMessages((prev) => [...prev, optimistic]);
    setMessage("");
    try {
      const userMsg = await sendUserMessage({ content, audioUrl });

      setMessages((prev) =>
        prev.map((m) => (m.messageId === tempId ? userMsg : m))
      );
    } catch (e) {
      console.error(e);

      setMessages((prev) => prev.filter((m) => m.messageId !== tempId));
      return;
    }

    const loadingAI: ChatMsg = {
      messageId: "loading-ai",
      conversationId,
      type: "AI",
      content: "AI가 대화를 생각하고 있어요..",
      translatedContent: "",
      audioUrl: null,
      createdAt: new Date().toISOString(),
      politenessScore: -1,
      naturalnessScore: -1,
      pronunciationScore: -1,
      isLoading: true,
    };

    setMessages((prev) => [...prev, loadingAI]);

    try {
      const aiMsg = await sendAiReply();

      setMessages((prev) =>
        prev.map((m) => (m.messageId === "loading-ai" ? aiMsg : m))
      );
    } catch (e) {
      console.error(e);
      setMessages((prev) => prev.filter((m) => m.messageId !== "loading-ai"));
    }
  };

  const handleFeedbacks = (messageId: string) => {
    createFeedback(messageId, {
      onSuccess: (feedback) => {
        setMessages((prev) =>
          prev.map((m) => (m.messageId === messageId ? { ...m, feedback } : m))
        );
        setFeedbackOpenId(messageId);
      },
    });
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
      <div className="min-h-screen bg-white flex flex-col  w-full">
        <ChatroomHeader
          name={myAI?.name}
          hidden={hidden}
          setHidden={setHidden}
          conversationId={id}
          onInfoOpen={() => setInfoOpen(true)}
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
        <ChatroomInfo
          isOpen={infoOpen}
          onClose={() => setInfoOpen(false)}
          companyName={conversation?.companyName ?? ""}
          jobTitle={conversation?.jobTitle ?? ""}
          interviewStyle={conversation?.interviewStyle ?? ""}
        />
      </div>
    </>
  );
}
