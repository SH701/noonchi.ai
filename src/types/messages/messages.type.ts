export interface ChatMsg {
  messageId: string;
  conversationId: number;
  type: "USER" | "AI";
  content: string;
  translatedContent?: string | null;
  audioUrl?: string | null;

  politenessScore?: number | null;
  naturalnessScore?: number | null;
  pronunciationScore?: number | null;

  reactionEmoji?: string | null;
  reactionDescription?: string | null;
  reactionReason?: string | null;
  recommendation?: string | null;

  feedback?: Feedback;
  isLoading?: boolean;
  createdAt: string;
}
export interface ImprovementPoint {
  point: string;
  tip: string;
}

export interface Feedback {
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
