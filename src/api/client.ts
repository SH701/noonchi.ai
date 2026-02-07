import { apiFetch } from "./api";
import { User } from "@/types/user/user.type";

import { normalizeChatMessage } from "@/utils/normalizeChatMessage";
import { ChatMsg, Feedback } from "@/types/messages";
import {
  Conversation,
  ConversationDetail,
  ConversationFeedback,
  FilterState,
} from "@/types/conversations";
import { filterMap } from "@/constants/filter";
import { TopicRes } from "@/types/topics";
import axios from "axios";

export const apiClient = {
  users: {
    getMe: async (): Promise<User> => {
      return apiFetch<User>("/api/users/me");
    },
  },
  topic: {
    getTopic: async (
      category: string,
      favoritesOnly: boolean,
    ): Promise<TopicRes[]> => {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      params.set("favoritesOnly", String(favoritesOnly));
      return apiFetch<TopicRes[]>(`/api/topics?${params.toString()}`);
    },
  },
  conversations: {
    getConversations: async (filter: FilterState) => {
      const status = filter ? filterMap[filter] : null;
      const queryString = new URLSearchParams({
        sortBy: "CREATED_AT_DESC",
        page: "1",
        size: "1000",
        ...(status && { status }),
      }).toString();
      return apiFetch<{ content: Conversation[] }>(
        `/api/conversations?${queryString}`,
        { cache: "no-cache" },
      );
    },
    getDetail: async (id: string): Promise<ConversationDetail> => {
      return apiFetch<ConversationDetail>(`/api/conversations/${id}`, {
        cache: "no-store",
      });
    },
    getConversationFeedback: async (
      conversationId: string,
    ): Promise<ConversationFeedback> => {
      return apiFetch<ConversationFeedback>(
        `/api/conversation/${conversationId}/feedback`,
        {
          cache: "no-cache",
        },
      );
    },
  },

  messages: {
    getList: async (conversationId: number): Promise<ChatMsg[]> => {
      const data = await apiFetch<{ content?: ChatMsg[] } | ChatMsg[]>(
        `/api/messages?conversationId=${conversationId}&page=1&size=20`,
        { cache: "no-store" },
      );
      const list = Array.isArray(data) ? data : (data?.content ?? []);
      const mapped = list.map((m) => normalizeChatMessage(m));
      return mapped.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    },

    getFeedback: async (messageId: string): Promise<Feedback> => {
      return apiFetch<Feedback>(`/api/messages/${messageId}/feedback`);
    },
  },
  preview: {
    getHint: async (sessionId: string): Promise<void> => {
      return axios.get(`/api/preview/${sessionId}/hints`);
    },
  },
};
