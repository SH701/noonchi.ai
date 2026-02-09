import { MyAI } from "../etc";
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
  conversationType: "ASK" | "ROLE_PLAYING";
  chatModelId: string;
  status: "ACTIVE" | "DONE";
  situation: string;
  createdAt: string;
  feedback?: Feedback | null;
  interviewCompanyName: string;
  interviewJobTitle: string;
  interviewJobPosting: string;
  conversationTrack: string;
  conversationTopic: string;
  taskCurrentLevel: number;
  taskCurrentName: string;
  taskAllCompleted: string;
  closeness: string;
  askTarget: string;
}

export interface ConversationDetail {
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
  conversationTrack: string;
  conversationTopic: string;
  canGetReport: boolean;
}

export interface ConversationFeedback {
  feedbackId: number;
  conversationId: number;
  politenessScore: number;
  naturalnessScore: number;
  pronunciationScore: number;
  summary: string;
  goodPoints: string;
  improvementPoints: ImprovementPoint[];
  overallEvaluation: string;
}

export type FilterState = "done" | "in-progress" | null;

export type SortOrder = "asc" | "desc";
export interface ImprovementPoint {
  point: string;
  tip: string;
}
