export type ChatMsg = {
  messageId: string;
  conversationId: number;
  role: "USER" | "AI";
  content: string;
  createdAt: string;
  feedback?: string;
  isLoading?: boolean;
  politenessScore?: number;
  naturalnessScore?: number;
};
