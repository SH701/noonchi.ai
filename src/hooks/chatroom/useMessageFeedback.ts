import { apiFetch } from "@/lib/api/api";
import { ChatMsg } from "@/types/chatmessage";
import { Feedback } from "@/types/feedback";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useMessageFeedback(conversationId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      try {
        const feedbackData = await apiFetch<Feedback>(
          `/api/messages/${messageId}/feedback`,
          {
            method: "GET",
          }
        );

        return feedbackData;
      } catch (error) {
        console.error("Failed to fetch message feedback:", error);
        throw error;
      }
    },

    onSuccess: (feedbackData, messageId) => {
      queryClient.setQueryData<ChatMsg[]>(
        ["messages", conversationId],
        (old) => {
          if (!old) return old;

          return old.map((msg) =>
            msg.messageId === messageId ? { ...msg, ...feedbackData } : msg
          );
        }
      );
    },
  });
}
