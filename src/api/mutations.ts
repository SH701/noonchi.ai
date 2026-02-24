import { apiFetch } from "./api";



import {
  InterviewFormData,
  
  UploadedFile,
  RoleplayReq,
  ConversationRes,
  AskReq,
  AskRes,
  PresignedUrlRes,
} from "@/types/conversations";
import { ChatMsg } from "@/types/messages";
import { Preview, PreviewSendRes } from "@/types/preview/preview.type";
import axios from "axios";
import { TopicScenario } from "@/types/topics";
import { AuthRes, LoginReq, SignupReq } from "@/types/auth";




export const apiMutations = {
  auth: {
    login: async (payload: LoginReq): Promise<AuthRes> => {
      return apiFetch<AuthRes>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ payload }),
      });
    },
    signup: async (payload: SignupReq): Promise<AuthRes> => {
      const response = await apiFetch<AuthRes>("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      console.log("signup response:", response);
      return response;
    },

    logout: async (): Promise<void> => {
      return apiFetch<void>("/api/auth/logout", {
        method: "POST",
      });
    },
  },

  messages: {
    roleplaysend: async (
      conversationId: number,
      content?: string,
      audioUrl?: string,
    ): Promise<ChatMsg> => {
      return apiFetch<ChatMsg>(`/api/messages/roleplay`, {
        method: "POST",
        body: JSON.stringify({ conversationId, content, audioUrl }),
      });
    },
    asksend: async (
      conversationId: number,
      content?: string,
      audioUrl?: string,
    ): Promise<ChatMsg> => {
      return apiFetch<ChatMsg>(`/api/messages/ask`, {
        method: "POST",
        body: JSON.stringify({ conversationId, content, audioUrl }),
      });
    },
    tts: async (messageId: number): Promise<string> => {
      return apiFetch<string>(`/api/messages/${messageId}/tts`, {
        method: "PUT",
      });
    },
    translate: async (messageId: number): Promise<string> => {
      return apiFetch<string>(`/api/messages/${messageId}/translate`, {
        method: "PUT",
      });
    },
  },

  conversations: {
    createInterview: async (
      data: InterviewFormData,
    ): Promise<ConversationRes> => {
      return apiFetch<ConversationRes>("/api/conversations/interview", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    createRoleplay: async (
      data: RoleplayReq,
    ): Promise<ConversationRes> => {
      return apiFetch<ConversationRes>("/api/conversations/role-playing", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    createAsk: async (data: AskReq): Promise<AskRes> => {
      return apiFetch<AskRes>("/api/conversations/ask", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    deleteConversation: async (conversationId: number): Promise<void> => {
      return apiFetch<void>(`/api/conversations/${conversationId}`, {
        method: "DELETE",
      });
    },
    endConversation: async (
      conversationId: number,
    ): Promise<number> => {
      return apiFetch<number>(
        `/api/conversations/${conversationId}/end`,
        { method: "PUT" },
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
          const presignedData = await apiFetch<PresignedUrlRes>(
            "/api/files/presigned-url",
            {
              method: "POST",
              body: JSON.stringify({
                fileExtension: file.name.split(".").pop(),
                fileType: file.type,
              }),
            },
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
        }),
      );
    },
    uploadAudio: async (blob: Blob): Promise<string> => {
      const blobType = blob.type || "audio/webm";
      const fileExtension = blobType.includes("webm") ? "webm" : "wav";
      const { url: presignedUrl } = await apiFetch<PresignedUrlRes>(
        "/api/files/presigned-url",
        {
          method: "POST",
          body: JSON.stringify({ fileType: blobType, fileExtension }),
        },
      );
      await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": blobType },
        body: blob,
      });

      return presignedUrl.split("?")[0];
    },
  },
  preview: {
    start: async (): Promise<Preview> => {
      const { data } = await axios.post<Preview>(
        `${process.env.NEXT_PUBLIC_PREVIEW_BASE_URL}/preview/roleplay/start`,
        null,
        {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY || "",
          },
        },
      );
      return data;
    },
    send: async (
      sessionId: string,
      userMessage: string,
      inputType: "text" | "voice" = "text",
      onChunk?: (chunk: string) => void,
    ): Promise<PreviewSendRes> => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PREVIEW_BASE_URL}/preview/roleplay/${sessionId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY || "",
          },
          body: JSON.stringify({
            user_message: userMessage,
            input_type: inputType,
          }),
        },
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let doneData: PreviewSendRes | null = null;
      let buffer = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const json = JSON.parse(line.slice(6));
            if (json.type === "chunk") {
              fullText += json.content;
              onChunk?.(fullText);
            } else if (json.type === "done") {
              doneData = json.data as PreviewSendRes;
            }
          }
        }
      }
      return doneData!;
    },
    remove: async (sessionId: string): Promise<void> => {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_PREVIEW_BASE_URL}/preview/roleplay/${sessionId}`,
        {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY || "",
          },
        },
      );
    },
  },
  topic: {
    addfavorite: async (topicId: number): Promise<void> => {
      return apiFetch<void>(`/api/topics/${topicId}/favorite`, {
        method: "POST",
      });
    },
    removefavorite: async (topicId: number): Promise<void> => {
      return apiFetch<void>(`/api/topics/${topicId}/favorite`, {
        method: "DELETE",
      });
    },
  },
  language: {
    createcontext: async (
      scenarioId: number,
      myRole?: string,
      aiRole?: string,
      detail?: string,
    ): Promise<TopicScenario> => {
      return apiFetch<TopicScenario>(`/api/language/scenario-context`, {
        method: "POST",
        body: JSON.stringify({ scenarioId, myRole, aiRole, detail }),
      });
    },
    stt: async (audioUrl: string): Promise<string> => {
      return apiFetch<string>(`/api/language/stt`, {
        method: "POST",
        body: JSON.stringify({ audioUrl }),
      });
    },
  },
};
