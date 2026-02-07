import { useQuery } from "@tanstack/react-query";

import { ConversationFeedback } from "@/types/conversations";
import { apiClient } from "@/api";

export function useConversationFeedback(conversationId: string) {
  return useQuery<ConversationFeedback>({
    queryKey: ["feedback", conversationId],

    queryFn: () =>
      apiClient.conversations.getConversationFeedback(conversationId),
  });
}
