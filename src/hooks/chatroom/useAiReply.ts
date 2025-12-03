import { apiFetch } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAiReply(conversationId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await apiFetch(
        `/api/messages/ai-reply?conversationId=${conversationId}`,
        {
          method: "POST",
        }
      );

      if (!res.ok) throw new Error("AI reply failed");

      return res.json();
    },

    onSuccess: (reply) => {
      queryClient.setQueryData(
        ["messages", conversationId],
        (old: any = []) => {
          return [...old, reply];
        }
      );
    },
  });
}
