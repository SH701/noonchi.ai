import { apiMutations } from "@/api/mutations";
import { useMutation } from "@tanstack/react-query";

export const useConversationEnd = (conversationId: number) => {
  return useMutation({
    mutationFn: () =>
      apiMutations.conversations.endConversation(conversationId),
  });
};
