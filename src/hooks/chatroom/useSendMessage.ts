import { apiFetch } from "@/lib/api/api";
import { ChatMsg } from "@/types/chatmessage";
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
      try {
        const data = await apiFetch<ChatMsg[]>("/api/messages", {
          method: "POST",
          body: JSON.stringify({ conversationId, content, audioUrl }),
        });

        return data;
      } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
      }
    },
  });
}
