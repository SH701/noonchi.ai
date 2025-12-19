import { apiClient } from "@/api/client";
import { apiMutations } from "@/api/mutations";

import { ChatMsg, Feedback } from "@/types/messages";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useMessageFeedback(conversationId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      try {
        const feedbackData = await apiClient.messages.getFeedback(messageId);
        return feedbackData;
      } catch (error) {
        console.error("Failed to fetch message feedback:", error);
        throw error;
      }
    },

    onSuccess: (feedbackData: Feedback, messageId: string) => {
      if (!conversationId) return;

      queryClient.setQueryData<ChatMsg[]>(
        ["messages", String(conversationId)],
        (old) => {
          if (!old) return old;

          return old.map((msg) =>
            msg.messageId === messageId
              ? { ...msg, feedback: feedbackData }
              : msg
          );
        }
      );
    },
  });
}

export function useMessageTTS() {
  return useMutation({
    mutationFn: async (messageId: string) => {
      try {
        const audioUrl = await apiMutations.messages.tts(messageId);
        return audioUrl;
      } catch (error) {
        console.error("Failed to fetch TTS audio:", error);
        throw error;
      }
    },
  });
}

export function useMessageTranslate() {
  return useMutation({
    mutationFn: async (messageId: string) => {
      try {
        const translatedText = await apiMutations.messages.translate(messageId);
        return translatedText;
      } catch (error) {
        console.error("Failed to fetch translation:", error);
        throw error;
      }
    },
  });
}
