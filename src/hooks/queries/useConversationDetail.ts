import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth/useAuth";
import { MyAI } from "@/types/persona";
import { apiFetch } from "@/lib/api/api";

export type ConversationDetail = {
  conversationId: number;
  userId: number;
  aiPersona: MyAI;
  status: "ACTIVE" | "ENDED";
  situation: string;
  chatNodeId: string;
  createdAt: string;
  endedAt: string | null;
  interviewCompanyName?: string;
  interviewJobTitle?: string;
  interviewStyle: string;
  taskCurrentLevel?: number;
  taskCurrentName?: string;
  taskAllCompleted?: boolean;
  conversationType?: string;
};

export function useConversationDetail(id?: string) {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery<ConversationDetail>({
    queryKey: ["conversation", id],
    enabled: !!accessToken && !!id,
    queryFn: async () => {
      try {
        const data = await apiFetch<ConversationDetail>(
          `/api/conversations/${id}`,
          {
            cache: "no-store",
          }
        );

        return data;
      } catch (error) {
        console.error("Failed to fetch conversation:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60,
  });
}
