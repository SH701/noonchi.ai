/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { ChatMsg } from "@/types/chatmessage";

export function useMessages(conversationId?: string) {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery<ChatMsg[]>({
    queryKey: ["messages", conversationId],
    enabled: !!accessToken && !!conversationId,
    queryFn: async () => {
      const res = await fetch(
        `/api/messages?conversationId=${conversationId}&page=1&size=20`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Failed to load messages (${res.status}): ${text || "Unknown"}`
        );
      }

      const data = await res.json();
      const list = (data?.content ?? data ?? []) as any[];

      return list.map((m) => ({
        messageId: m.messageId,
        conversationId: m.conversationId,
        role: (m.role ?? m.type) as "USER" | "AI",
        content: m.content ?? "",
        createdAt: m.createdAt ?? new Date().toISOString(),
        politenessScore: m.politenessScore ?? -1,
        naturalnessScore: m.naturalnessScore ?? -1,
      }));
    },
    staleTime: 0,
    gcTime: 0,
  });
}
