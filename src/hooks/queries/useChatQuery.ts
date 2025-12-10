/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth/useAuth";
import { ChatMsg } from "@/types/chatmessage";
import { apiFetch } from "@/lib/api/api";
import { normalizeChatMessage } from "../../utils/normalizeChatMessage";

export function useChatQuery(conversationId?: string) {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery<ChatMsg[]>({
    queryKey: ["messages", conversationId],
    enabled: !!accessToken && !!conversationId,
    queryFn: async () => {
      const data = await apiFetch<{ content?: any[] } | any[]>(
        `/api/messages?conversationId=${conversationId}&page=1&size=20`,
        { cache: "no-store" }
      );

      const list = Array.isArray(data) ? data : (data?.content ?? []);

      const mapped = list.map((m) => normalizeChatMessage(m));

      return mapped.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    },
    staleTime: 2000,
    gcTime: 1000 * 60 * 3,
  });
}
