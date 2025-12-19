import { Feedback } from "../messages";

export interface ConversationResponse {
  conversationId: number;
}
export interface Conversation {
  conversationId: number;
  userId: number;
  aiPersona: {
    id: number;
    personaId: number;
    userId: number;
    name: string;
    gender: string;
    age: number;
    relationship: string;
    description: string;
    profileImageUrl: string;
  };
  status: string;
  situation: string;
  createdAt: string;
  feedback?: Feedback | null;
}

export type FilterState = "done" | "in-progress" | null;

export type SortOrder = "asc" | "desc";
