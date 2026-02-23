import { useState } from "react";
import { useRecorder } from "@/hooks/useRecorder";
import { apiMutations } from "@/api/mutations";

export type MicState = "idle" | "recording" | "recorded";

export function useVoiceChat(
  conversationId?: number,
  sendMessage?: (content?: string, audioUrl?: string) => Promise<void> | void,
) {
  const { startRecording, stopRecording } = useRecorder();
  const [micState, setMicState] = useState<MicState>("idle");
  const [pendingAudioUrl, setPendingAudioUrl] = useState<string | null>(null);
  const [sttText, setSttText] = useState("");

  const handleMicClick = async () => {
    if (micState === "idle") {
      setMicState("recording");
      try {
        await startRecording();
      } catch {
        setMicState("idle");
      }
    } else if (micState === "recording") {
      try {
        const blob = await stopRecording();
        if (!blob || blob.size === 0) {
          throw new Error("빈 오디오 blob");
        }
        const audioUrl = await apiMutations.files.uploadAudio(blob);
        const content = await apiMutations.language.stt(audioUrl);
        setSttText(content);
        setMicState("recorded");
        setPendingAudioUrl(audioUrl);
      } catch {
        handleResetAudio();
      }
    }
  };

  const handleResetAudio = () => {
    setPendingAudioUrl(null);
    setMicState("idle");
    setSttText("");
  };

  const handleSendAudio = async () => {
    if (!sttText || !pendingAudioUrl) return;
    if (!conversationId || !sendMessage) return;
    await sendMessage(sttText, pendingAudioUrl);
    handleResetAudio();
    setSttText("");
  };

  return {
    micState,
    pendingAudioUrl,
    sttText,
    handleMicClick,
    handleResetAudio,
    handleSendAudio,
  };
}
