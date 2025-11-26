import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { MyAI } from "@/types/persona";


export type ConversationDetail = {
  conversationId: number;
  userId: number;
  aiPersona: MyAI;
  status: "ACTIVE" | "ENDED";
  situation: string;
  chatNodeId: string;
  createdAt: string;
  endedAt: string | null;
};

export function useConversationDetail(id?: string) {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery<ConversationDetail>({
    queryKey: ["conversation", id],
    enabled: !!accessToken && !!id,
    queryFn: async () => {
      const res = await fetch(`/api/conversations/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Failed to load conversation (${res.status}): ${text || "Unknown"}`
        );
      }

      return res.json();
    },
    staleTime: 1000 * 60, // 1분 동안 캐시
  });
}
