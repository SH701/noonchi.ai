import { useQuery } from "@tanstack/react-query";
import { Conversation, FilterState } from "@/types/conversations";
import { apiClient } from "@/api/client";

export const useConversations = (filter: FilterState = null) => {
  return useQuery({
    queryKey: ["conversations", "history", filter],
    queryFn: () => apiClient.conversations.getConversations(filter),
    select: (data) =>
      (data?.content ?? []).filter((c): c is Conversation => !!c?.aiPersona),
  });
};
