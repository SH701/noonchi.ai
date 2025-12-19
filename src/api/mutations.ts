import { apiFetch } from "./api";

import { AuthResponse, LoginRequest, SignupRequest } from "@/types/auth";
import { normalizeChatMessage } from "@/utils/normalizeChatMessage";

import {
  InterviewApiRequest,
  PresignedUrlResponse,
  UploadedFile,
  ConversationResponse,
  RoleplayApiRequest,
} from "@/types/conversations";
import { ChatMsg } from "@/types/messages";

interface SendMessageResponse {
  taskResult: {
    isTaskCompleted: boolean;
    isTaskAllCompleted: boolean;
    resultTaskLevel: number;
    resultTaskName: string;
  };
  messages: ChatMsg[];
}

export interface DeleteConversationResponse {
  conversationId: number;
}
export interface EndConversationResponse {
  conversationId: number;
}

export const apiMutations = {
  auth: {
    login: async (payload: LoginRequest): Promise<AuthResponse> => {
      return apiFetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ payload }),
      });
    },

    signup: async (payload: SignupRequest): Promise<AuthResponse> => {
      return apiFetch<AuthResponse>("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },

    logout: async (): Promise<void> => {
      return apiFetch<void>("/api/auth/logout", {
        method: "POST",
      });
    },

    guestLogin: async (deviceId: string): Promise<AuthResponse> => {
      return apiFetch<AuthResponse>("/api/auth/guest-login", {
        method: "POST",
        body: JSON.stringify({ deviceId }),
      });
    },
  },

  messages: {
    send: async (params: {
      conversationId?: number;
      content?: string;
      audioUrl?: string;
    }): Promise<{
      taskResult: SendMessageResponse["taskResult"];
      messages: ChatMsg[];
    }> => {
      const data = await apiFetch<SendMessageResponse>("/api/messages", {
        method: "POST",
        body: JSON.stringify(params),
      });

      const normalized = data.messages.map((m) => normalizeChatMessage(m));

      return {
        taskResult: data.taskResult,
        messages: normalized,
      };
    },
    tts: async (messageId: string): Promise<string> => {
      const audioUrl = await apiFetch<string>(
        `/api/messages/${messageId}/tts`,
        {
          method: "PUT",
        }
      );
      return audioUrl;
    },
    translate: async (messageId: string): Promise<string> => {
      const translatedText = await apiFetch<string>(
        `/api/messages/${messageId}/translate`,
        {
          method: "PUT",
        }
      );
      return translatedText;
    },
  },

  conversations: {
    createInterview: async (
      data: InterviewApiRequest
    ): Promise<ConversationResponse> => {
      return apiFetch<ConversationResponse>("/api/conversations/interview", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    createRoleplay: async (
      data: RoleplayApiRequest
    ): Promise<ConversationResponse> => {
      return apiFetch<ConversationResponse>("/api/conversations/role-playing", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    deleteConversation: async (
      conversationId: string
    ): Promise<DeleteConversationResponse | null> => {
      return apiFetch<DeleteConversationResponse | null>(
        `/api/conversations/${conversationId}`,
        {
          method: "DELETE",
        }
      );
    },
    endConversation: async (
      conversationId: string
    ): Promise<EndConversationResponse> => {
      return apiFetch<EndConversationResponse>(
        `/api/conversations/${conversationId}/end`,
        { method: "PUT" }
      );
    },
  },

  users: {
    deductCredit: async (amount: number): Promise<void> => {
      return apiFetch<void>("/api/users/credit/deduct", {
        method: "POST",
        body: JSON.stringify({ amount }),
      });
    },
    chargeCredit: async (amount: number): Promise<void> => {
      return apiFetch<void>("api/users/credit/charge", {
        method: "POST",
        body: JSON.stringify({ amount }),
      });
    },
  },

  files: {
    uploadFiles: async (files: File[]): Promise<UploadedFile[]> => {
      return Promise.all(
        files.map(async (file) => {
          const presignedData = await apiFetch<PresignedUrlResponse>(
            "/api/files/presigned-url",
            {
              method: "POST",
              body: JSON.stringify({
                fileExtension: file.name.split(".").pop(),
                fileType: file.type,
              }),
            }
          );

          await fetch(presignedData.url, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });

          return {
            fileUrl: presignedData.url.split("?")[0],
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
          };
        })
      );
    },
  },
};
