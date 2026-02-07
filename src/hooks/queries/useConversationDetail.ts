import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/client";

import { ConversationDetail } from "@/types/conversations";

export function useConversationDetail(id?: string) {
  return useQuery<ConversationDetail>({
    queryKey: ["conversation", id],
    queryFn: () => apiClient.conversations.getDetail(id!),
  });
}
