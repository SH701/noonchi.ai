import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth/useAuth";

import { apiClient } from "@/lib/api/client";
import { ChatMsg } from "@/types/messages";

export function useChatQuery(conversationId?: string) {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery<ChatMsg[]>({
    queryKey: ["messages", conversationId],
    enabled: !!accessToken && !!conversationId,
    queryFn: async () => {
      return apiClient.messages.getList(conversationId!);
    },
    staleTime: 2000,
    gcTime: 1000 * 60 * 3,
  });
}
