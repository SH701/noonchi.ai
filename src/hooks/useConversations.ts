/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Conversation } from "@/lib/types";
import { Filter } from "@/src/store/useChatHistorystore";

const filterMap: Record<Exclude<Filter, null>, string> = {
  done: "ENDED",
  "in-progress": "ACTIVE",
};

const normalizeConversations = (arr: unknown): Conversation[] =>
  (Array.isArray(arr) ? arr : [])
    .filter(Boolean)
    .filter((c: any) => !!c?.aiPersona) as Conversation[];

export const useConversations = (
  accessToken?: string | null,
  filter: Filter = null
) => {
  return useQuery({
    queryKey: ["conversations", "history", filter],
    enabled: !!accessToken,
    queryFn: async () => {
      if (!accessToken) return [];
      let query = "/api/conversations?sortBy=CREATED_AT_DESC&page=1&size=1000";
      if (filter && filterMap[filter]) {
        query += `&status=${filterMap[filter]}`;
      }
      const res = await fetch(query, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${errText}`);
      }

      const data = await res.json();
      return normalizeConversations(data?.content);
    },
  });
};

export const useDeleteConversation = (accessToken?: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string | number) => {
      if (!accessToken) {
        throw new Error("No access token");
      }

      const res = await fetch(`/api/conversations/${conversationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete chat");
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
