import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth/useAuth";
import { apiClient, ConversationDetail } from "@/api/client";

export function useConversationDetail(id?: string) {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery<ConversationDetail>({
    queryKey: ["conversation", id],
    enabled: !!accessToken && !!id,
    queryFn: async () => {
      try {
        const data = await apiClient.conversations.getDetail(id!);
        return data;
      } catch (error) {
        console.error("Failed to fetch conversation:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60,
  });
}
