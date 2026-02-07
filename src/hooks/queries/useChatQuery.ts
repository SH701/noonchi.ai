import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/client";
import { ChatMsg } from "@/types/messages";

export function useChatQuery(conversationId?: number) {
  return useQuery<ChatMsg[]>({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      return apiClient.messages.getList(conversationId!);
    },
    enabled: !!conversationId,
    staleTime: 2000,
    gcTime: 1000 * 60 * 3,
  });
}
