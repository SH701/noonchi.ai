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
        ["messages", conversationId],
        (old) => {
          if (!old) return old;
          return old.map((msg) =>
            String(msg.messageId) === messageId
              ? { ...msg, feedback: feedbackData }
              : msg,
          );
        },
      );
    },
  });
}

export function useMessageTTS() {
  return useMutation({
    mutationFn: (messageId: string) =>
      apiMutations.messages.tts(Number(messageId)),
  });
}

export function useMessageTranslate() {
  return useMutation({
    mutationFn: (messageId: string) =>
      apiMutations.messages.translate(Number(messageId)),
  });
}
