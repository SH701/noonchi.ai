export type ChatMsg = {
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

  feedback?: any;
  isLoading?: boolean;
  createdAt: string;
};
