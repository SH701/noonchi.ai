import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/client";

import { ConversationDetail } from "@/types/conversations";

export function useConversationDetail(id?: string) {
  return useQuery<ConversationDetail>({
    queryKey: ["conversation", id],

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
