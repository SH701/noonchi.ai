import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuth";
import { MyAI } from "@/types/persona";
import { apiFetch } from "@/lib/api";

export type ConversationDetail = {
  conversationId: number;
  userId: number;
  aiPersona: MyAI;
  status: "ACTIVE" | "ENDED";
  situation: string;
  chatNodeId: string;
  createdAt: string;
  endedAt: string | null;
  companyName: string;
  jobTitle: string;
  interviewStyle: string;
};

export function useConversationDetail(id?: string) {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery<ConversationDetail>({
    queryKey: ["conversation", id],
    enabled: !!accessToken && !!id,
    queryFn: async () => {
      const res = await apiFetch(`/api/conversations/${id}`, {
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
    staleTime: 1000 * 60,
  });
}
