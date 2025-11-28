export type ChatMsg = {
  messageId: string;
  conversationId: number;
  role: "USER" | "AI";
  content: string;
  translatedContent?: string;
  audioUrl?: string | null;
  createdAt: string;
  politenessScore?: number;
  naturalnessScore?: number;
  pronunciationScore?: number;
  feedback?: string;
  isLoading?: boolean;
};
