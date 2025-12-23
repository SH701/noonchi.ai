import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/api/api";
import { Feedback } from "@/types/messages";

export function useConversationFeedback(conversationId?: string) {
  return useQuery<Feedback>({
    queryKey: ["feedback", conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      try {
        const data = await apiFetch<Feedback>(
          `/api/conversations/${conversationId}/feedback`,
          {
            cache: "no-store",
          }
        );

        return data;
      } catch (error) {
        console.error("Failed to fetch feedback:", error);
        throw error;
      }
    },
    staleTime: 0,
    gcTime: 0,
  });
}
