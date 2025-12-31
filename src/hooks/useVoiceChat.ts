import { useState } from "react";
import { useRecorder } from "@/hooks/useRecorder";
import { useAuthStore } from "@/store/auth/useAuth";

type MicState = "idle" | "recording" | "recorded";

export function useVoiceChat(
  conversationId?: number,
  sendMessage?: (content?: string, audioUrl?: string) => Promise<void> | void
) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const { startRecording, stopRecording } = useRecorder();

  const [micState, setMicState] = useState<MicState>("idle");
  const [, setPendingAudioFile] = useState<Blob | null>(null);
  const [pendingAudioUrl, setPendingAudioUrl] = useState<string | null>(null);
  const [sttText, setSttText] = useState("");
  const [showVoiceError, setShowVoiceError] = useState(false);

  const showVoiceErrorMessage = () => {
    setShowVoiceError(true);
    setTimeout(() => {
      setShowVoiceError(false);
    }, 3000);
  };

  const handleMicClick = async () => {
    if (micState === "idle") {
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
        const localUrl = URL.createObjectURL(blob);

        if (!blob || blob.size === 0) {
          throw new Error("빈 오디오 blob");
        }

        setPendingAudioFile(blob);
        setPendingAudioUrl(localUrl);

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

        const sttRes = await fetch("/api/language/stt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ audioUrl }),
        });

        if (!sttRes.ok) {
          throw new Error("STT 요청 실패");
        }

        const content = await sttRes.text();

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
      } catch {
        /* empty */
      }
    }
    setPendingAudioFile(null);
    setPendingAudioUrl(null);
    setMicState("idle");
    setSttText("");
  };

  const handleSendAudio = async () => {
    if (!sttText || !pendingAudioUrl) return;
    if (!conversationId || !sendMessage) return;

    try {
      await sendMessage(sttText, pendingAudioUrl);
      handleResetAudio();
      setSttText("");
    } catch (e) {
      console.error("❌ handleSendAudio error:", e);
      showVoiceErrorMessage();
    }
  };

  return {
    micState,
    pendingAudioUrl,
    sttText,
    showVoiceError,
    handleMicClick,
    handleResetAudio,
    handleSendAudio,
  };
}
