import { apiMutations } from "@/api/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useConversationEnd = (conversationId: number) => {
  return useMutation({
    mutationFn: () =>
      apiMutations.conversations.endConversation(conversationId),
  });
};

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: number) =>
      apiMutations.conversations.deleteConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
        exact: false,
        refetchType: "all",
      });
    },
  });
}
