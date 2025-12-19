import { apiFetch } from "./api";
import { User } from "@/types/user/user.type";
import { ChatMsg } from "@/types/chatmessage";
import { Feedback } from "@/types/feedback";
import { MyAI } from "@/types/persona";
import { normalizeChatMessage } from "@/utils/normalizeChatMessage";

export type ConversationDetail = {
  conversationId: number;
  userId: number;
  aiPersona: MyAI;
  status: "ACTIVE" | "ENDED";
  situation: string;
  chatNodeId: string;
  createdAt: string;
  endedAt: string | null;
  interviewCompanyName?: string;
  interviewJobTitle?: string;
  interviewStyle: string;
  taskCurrentLevel?: number;
  taskCurrentName?: string;
  taskAllCompleted?: boolean;
  conversationType?: string;
};

export const apiClient = {
  users: {
    getMe: async (): Promise<User> => {
      return apiFetch<User>("/api/users/me");
    },
  },

  conversations: {
    getDetail: async (id: string): Promise<ConversationDetail> => {
      return apiFetch<ConversationDetail>(`/api/conversations/${id}`, {
        cache: "no-store",
      });
    },
  },

  messages: {
    getList: async (conversationId: string): Promise<ChatMsg[]> => {
      const data = await apiFetch<{ content?: ChatMsg[] } | ChatMsg[]>(
        `/api/messages?conversationId=${conversationId}&page=1&size=20`,
        { cache: "no-store" }
      );

      const list = Array.isArray(data) ? data : (data?.content ?? []);
      const mapped = list.map((m) => normalizeChatMessage(m));

      return mapped.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    },

    getFeedback: async (messageId: string): Promise<Feedback> => {
      return apiFetch<Feedback>(`/api/messages/${messageId}/feedback`);
    },
  },
};
