export interface ChatMsg {
  messageId: number;
  conversationId: number;
  type: "USER" | "AI" | "SYSTEM";
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
  hiddenMeaning: string;
  visualAction: string;
  situationDescription: string;
  askApproachTip?: string;
  askCulturalInsight?: string;
}

export interface Feedback {
  feedbackId: number;
  messageId: number;
  politenessScore: number;
  naturalnessScore: number;
  pronunciationScore: number;
  appropriateExpression: string;
  contentsFeedback: string;
  nuanceFeedback: string;
}
