import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export function useSendMessage(conversationId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      content,
      audioUrl,
    }: {
      content?: string;
      audioUrl?: string;
    }) => {
      const res = await apiFetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({ conversationId, content, audioUrl }),
      });

      if (res.status === 409) {
        const text = await res.text();
        throw new Error(text);
      }

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      return res.json();
    },

    onSuccess: (newMessage) => {
      queryClient.setQueryData(
        ["messages", conversationId],
        (old: any = []) => {
          return [...old, newMessage];
        }
      );
    },
  });
}
