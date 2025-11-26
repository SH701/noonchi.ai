import { Feedback } from "./feedback";

export type Conversation = {
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
};
