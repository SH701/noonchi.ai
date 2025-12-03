/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuth";
import { ChatMsg } from "@/types/chatmessage";
import { apiFetch } from "@/lib/api";

export function useMessages(conversationId?: string) {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery<ChatMsg[]>({
    queryKey: ["messages", conversationId],
    enabled: !!accessToken && !!conversationId,
    queryFn: async () => {
      const res = await apiFetch(
        `/api/messages?conversationId=${conversationId}&page=1&size=20`,
        { cache: "no-store" }
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
        type: (m.type ?? m.role) as "USER" | "AI",
        content: m.content ?? "",
        translatedContent: m.translatedContent,
        audioUrl: m.audioUrl ?? null,
        createdAt: m.createdAt ?? new Date().toISOString(),
        politenessScore: m.politenessScore ?? -1,
        naturalnessScore: m.naturalnessScore ?? -1,
        pronunciationScore: m.pronunciationScore ?? -1,
        feedback: m.feedback,
      }));
    },
    staleTime: 0,
    gcTime: 0,
  });
}
