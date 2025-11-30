import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { Feedback } from "@/types/feedback";

export function useConversaitonFeedback(conversationId?: string) {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery<Feedback>({
    queryKey: ["feedback", conversationId],
    enabled: !!accessToken && !!conversationId,
    queryFn: async () => {
      const res = await fetch(`/api/conversations/${conversationId}/feedback`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });

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
