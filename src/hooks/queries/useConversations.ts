import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Conversation, FilterState } from "@/types/conversations";

import { apiFetch } from "@/api/api";
import { apiMutations, DeleteConversationResponse } from "@/api/mutations";

const filterMap: Record<Exclude<FilterState, null>, string> = {
  done: "ENDED",
  "in-progress": "ACTIVE",
};

type ConversationsResponse = {
  content: unknown;
};

const normalizeConversations = (arr: unknown): Conversation[] =>
  (Array.isArray(arr) ? arr : [])
    .filter(Boolean)
    .filter((c: unknown): c is Conversation => {
      const conversation = c as Partial<Conversation>;
      return !!conversation?.aiPersona;
    });

export const useConversations = (filter: FilterState = null) => {
  return useQuery<Conversation[], Error>({
    queryKey: ["conversations", "history", filter],
    queryFn: async () => {
      let query = `/api/conversations?sortBy=CREATED_AT_DESC&page=1&size=1000`;

      if (filter && filterMap[filter]) {
        query += `&status=${filterMap[filter]}`;
      }

      try {
        const data = await apiFetch<ConversationsResponse>(query);
        return normalizeConversations(data?.content);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
        throw error;
      }
    },
  });
};

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation<DeleteConversationResponse | null, Error, string | number>(
    {
      mutationFn: async (conversationId: string | number) => {
        try {
          const result = await apiMutations.conversations.deleteConversation(
            String(conversationId)
          );
          return result;
        } catch (error) {
          console.error("Failed to delete conversation:", error);
          throw error;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["conversations"],
          exact: false,
          refetchType: "all",
        });
      },
    }
  );
}
