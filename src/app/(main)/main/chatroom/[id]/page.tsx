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

import {
  ChatroomHeader,
  ChatroomInfo,
  ChatroomInput,
  MessageList,
} from "@/components/chatroom";

type MicState = "idle" | "recording" | "recorded";

export default function ChatroomPage() {
  const { id } = useParams<{ id: string }>();

  const accessToken = useAuthStore((s) => s.accessToken);
  const [infoOpen, setInfoOpen] = useState(false);
  const { startRecording, stopRecording } = useRecorder();
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
  const [isInitialized, setIsInitialized] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isAIResponding = messages.some((m) => m.isLoading && m.type === "AI");
  const [sttText, setSttText] = useState("");
  const {
    data: conversation,
    isLoading: isConversationLoading,
    error: conversationError,
  } = useConversationDetail(id);
  const { refetch: refetchConversation } = useConversationDetail(id);
  const conversationId = conversation?.conversationId ?? 0;
  const myAI = conversation?.aiPersona ?? null;
  const { mutateAsync: chatting } = useSendMessage();
  const { mutate: createFeedback } = useMessageFeedback(conversationId);
  const {
    data: initialMessages = "",
    isLoading: isMessagesLoading,
    error: messagesError,
  } = useMessages(id);

  useEffect(() => {
    if (!isInitialized && initialMessages && initialMessages.length > 0) {
      setMessages(initialMessages);
      setIsInitialized(true);
    }
  }, [initialMessages, isInitialized]);

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
    if (!content && !audioUrl) return;

    setLoading(true);
    const tempId = "temp-" + Date.now();

    const optimistic: ChatMsg = {
      messageId: tempId,
      conversationId,
      type: "USER",
      content: content ?? "[Voice Message]",
      audioUrl: audioUrl ?? null,
      createdAt: new Date().toISOString(),
    };

    const loadingBubble: ChatMsg = {
      messageId: "ai-loading",
      conversationId,
      type: "AI",
      content: "",
      audioUrl: null,
      createdAt: new Date().toISOString(),
      isLoading: true,
    };

    // 사용자 메시지 + AI 로딩 말풍선 추가
    setMessages((prev) => [...prev, optimistic, loadingBubble]);
    setMessage("");

    try {
      const res = await chatting({
        conversationId,
        content,
        audioUrl,
      });

      const responseMessages = res.messages;

      const serverUserMsg = responseMessages.find(
        (m: ChatMsg) => m.type === "USER"
      );
      const aiMsg = responseMessages.find((m: ChatMsg) => m.type === "AI");

      setLoading(false);

      setMessages((prev) => {
        const filtered = prev.filter(
          (msg) => msg.messageId !== tempId && msg.messageId !== "ai-loading"
        );

        return [...filtered, serverUserMsg!, aiMsg!];
      });

      await refetchConversation();
    } catch (err) {
      console.error("sendMessage error", err);
      setMessages((prev) => prev.filter((msg) => msg.messageId !== tempId));
    }
  };

  const handleFeedbacks = (messageId: string) => {
    if (feedbackOpenId === messageId) {
      setFeedbackOpenId(null);
      return;
    }

    const targetMessage = messages.find((m) => m.messageId === messageId);
    if (targetMessage?.feedback) {
      setFeedbackOpenId(messageId);
      return;
    }

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
      // 🔴 아직 녹음 안 하는 상태 → 녹음 시작
      setMicState("recording");
      try {
        await startRecording();
      } catch (error) {
        console.error("녹음 시작 실패:", error);
        setMicState("idle");
        showVoiceErrorMessage();
      }
    } else if (micState === "recording") {
      try {
        const blob = await stopRecording();
        const url = URL.createObjectURL(blob);
        console.log("🎧 녹음 blob size:", blob.size, "type:", blob.type);

        if (!blob || blob.size === 0) {
          throw new Error("빈 오디오 blob");
        }

        setPendingAudioFile(blob);

        setPendingAudioUrl(url);

        if (!accessToken || !conversationId) {
          throw new Error("토큰 또는 대화 ID 없음");
        }

        const blobType = blob.type || "audio/webm";
        const fileExtension = blobType.includes("webm") ? "webm" : "wav";

        const presignRes = await fetch("/api/files/presigned-url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            fileType: blobType,
            fileExtension,
          }),
        });

        if (!presignRes.ok) {
          throw new Error("presigned-url 요청 실패");
        }

        const { url: presignedUrl } = await presignRes.json();

        const uploadRes = await fetch(presignedUrl, {
          method: "PUT",
          headers: { "Content-Type": blobType },
          body: blob,
        });

        if (!uploadRes.ok) {
          throw new Error("S3 업로드 실패");
        }

        const audioUrl = presignedUrl.split("?")[0];

        const sttres = await fetch("/api/language/stt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            audioUrl,
          }),
        });

        if (!sttres.ok) {
          throw new Error("STT 요청 실패");
        }

        const content = await sttres.text();

        setSttText(content);
        setMicState("recorded");

        setPendingAudioUrl(audioUrl);
      } catch (error) {
        console.error("녹음 중지/STT 변환 실패:", error);
        showVoiceErrorMessage();
        handleResetAudio();
      }
    }
  };

  const handleResetAudio = () => {
    if (pendingAudioUrl) {
      try {
        URL.revokeObjectURL(pendingAudioUrl);
      } catch {}
    }
    setPendingAudioFile(null);
    setPendingAudioUrl(null);
    setMicState("idle");
    setSttText("");
  };

  const handleSendAudio = async () => {
    if (!sttText || !pendingAudioUrl) return;
    if (!accessToken || !conversationId) return;

    try {
      setLoading(true);

      await sendMessage(sttText, pendingAudioUrl);

      handleResetAudio();
      setSttText("");
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
    return <Loading />;
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
          isAIResponding={isAIResponding}
          setMessage={setMessage}
          handleMicClick={handleMicClick}
          handleResetAudio={handleResetAudio}
          handleSendAudio={handleSendAudio}
          sendMessage={sendMessage}
          sttText={sttText}
        />
        <ChatroomInfo
          isOpen={infoOpen}
          onClose={() => setInfoOpen(false)}
          companyName={conversation?.interviewCompanyName ?? ""}
          jobTitle={conversation?.interviewJobTitle ?? ""}
          interviewStyle={conversation?.interviewStyle ?? ""}
        />
      </div>
    </>
  );
}
