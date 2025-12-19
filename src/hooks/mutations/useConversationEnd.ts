import { apiMutations } from "@/lib/api/mutations";
import { useMutation } from "@tanstack/react-query";

export const useConversationEnd = () => {
  return useMutation({
    mutationFn: apiMutations.conversations.endConversation,
  });
};
