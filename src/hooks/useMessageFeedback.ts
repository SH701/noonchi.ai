import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useMessageFeedback(
  conversationId?: number,
  accessToken?: string | null
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const res = await fetch(`/api/messages/${messageId}/feedback`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) throw new Error("Feedback API failed");

      return res.json();
    },

    onSuccess: (feedbackData, messageId) => {
      queryClient.setQueryData(["messages", conversationId], (old: any) => {
        if (!old) return old;

        return old.map((msg: any) =>
          msg.messageId === messageId ? { ...msg, feedback: feedbackData } : msg
        );
      });
    },
  });
}
