/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Conversation } from "@/types/conversation";
import { FilterState } from "@/types/history";
import { apiFetch } from "@/lib/api";

const filterMap: Record<Exclude<FilterState, null>, string> = {
  done: "ENDED",
  "in-progress": "ACTIVE",
};

const normalizeConversations = (arr: unknown): Conversation[] =>
  (Array.isArray(arr) ? arr : [])
    .filter(Boolean)
    .filter((c: any) => !!c?.aiPersona) as Conversation[];

export const useConversations = (filter: FilterState = null) => {
  return useQuery({
    queryKey: ["conversations", "history", filter],
    queryFn: async () => {
      let query = "/api/conversations?sortBy=CREATED_AT_DESC&page=1&size=1000";

      if (filter && filterMap[filter]) {
        query += `&status=${filterMap[filter]}`;
      }

      const res = await apiFetch(query);

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${errText}`);
      }

      const data = await res.json();
      return normalizeConversations(data?.content);
    },
  });
};
export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string | number) => {
      const res = await apiFetch(`/api/conversations/${conversationId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to delete chat: ${text}`);
      }

      return conversationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", "history"],
      });
    },
  });
};
