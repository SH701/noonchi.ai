import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { ConversationDetail } from "@/types/conversations";

export function useConversationDetail(
  conversationId?: number,
  options?: Partial<UseQueryOptions<ConversationDetail>>,
) {
  return useQuery<ConversationDetail>({
    queryKey: ["conversationDetail", conversationId],
    queryFn: () => apiClient.conversations.getDetail(conversationId!),

    ...options,

    enabled:
      options?.enabled !== false && !!conversationId && conversationId !== 0,
  });
}
