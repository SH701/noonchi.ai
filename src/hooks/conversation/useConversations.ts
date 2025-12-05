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
      let query = `/api/conversations?sortBy=CREATED_AT_DESC&page=1&size=1000`;

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

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string | number) => {
      console.log("🗑️ Deleting conversation:", conversationId);

      const response = await apiFetch(`/api/conversations/${conversationId}`, {
        method: "DELETE",
      });

      console.log("Delete response status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to delete conversation");
      }

      if (response.status === 204) {
        return null;
      }

      return response.json();
    },
    onSuccess: (data, conversationId) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
        exact: false,
        refetchType: "all",
      });
    },
  });
}
