import { apiFetch } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function useSendMessage() {
  return useMutation({
    mutationFn: async ({
      content,
      audioUrl,
      conversationId,
    }: {
      conversationId?: number;
      content?: string;
      audioUrl?: string;
    }) => {
      const res = await apiFetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({ conversationId, content, audioUrl }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      return res.json();
    },
  });
}
