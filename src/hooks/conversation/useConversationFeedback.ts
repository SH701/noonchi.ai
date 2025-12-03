import { useQuery } from "@tanstack/react-query";

import { Feedback } from "@/types/feedback";
import { apiFetch } from "@/lib/api";

export function useConversaitonFeedback(conversationId?: string) {
  return useQuery<Feedback>({
    queryKey: ["feedback", conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      const res = await apiFetch(
        `/api/conversations/${conversationId}/feedback`,
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Failed to fetch feedback (${res.status}): ${text || "Unknown"}`
        );
      }

      return await res.json();
    },
    staleTime: 0,
    gcTime: 0,
  });
}
