import { ChatMsg } from "@/types/messages";


export function normalizeChatMessage(m: ChatMsg) {
  return {
    messageId: m.messageId,
    conversationId: m.conversationId,
    type: m.type as "USER" | "AI",
    content: m.content ?? "",
    translatedContent: m.translatedContent ?? null,
    audioUrl: m.audioUrl ?? null,
    createdAt: m.createdAt ?? new Date().toISOString(),
    politenessScore: m.politenessScore ?? -1,
    naturalnessScore: m.naturalnessScore ?? -1,
    pronunciationScore: m.pronunciationScore ?? -1,
    feedback: m.feedback,
    reactionEmoji: m.reactionEmoji,
    reactionDescription: m.reactionDescription,
    reactionReason: m.reactionReason,
    recommendation: m.recommendation,
  };
}
