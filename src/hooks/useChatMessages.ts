import { useMemo, useState } from "react";
import { ChatMsg } from "@/types/messages";
import { useMessageFeedback } from "./mutations/useMessageFeedback";
import { useSendMessage } from "./mutations/useSendMessage";
import { useChatQuery } from "./queries/useChatQuery";
import { useQueryClient } from "@tanstack/react-query";

export function useChatMessages(conversationId?: number) {
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMsg[]>([]);
  const queryClient = useQueryClient();

  const { data: serverMessages = [], isLoading: isMessagesLoading } =
    useChatQuery(conversationId);

  const { mutateAsync: sendMutation, isPending } = useSendMessage();
  const { mutate: createFeedback } = useMessageFeedback(conversationId ?? 0);

  const messages = useMemo(() => {
    if (optimisticMessages.length === 0) return serverMessages;

    const optimisticIds = new Set(optimisticMessages.map((m) => m.messageId));
    const merged = [
      ...serverMessages.filter((m) => !optimisticIds.has(m.messageId)),
      ...optimisticMessages,
    ];

    return merged.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [serverMessages, optimisticMessages]);

  const isAIResponding = useMemo(
    () => messages.some((m) => m.isLoading && m.type === "AI"),
    [messages],
  );

  const sendMessage = async (content?: string, audioUrl?: string) => {
    if (!conversationId) return;
    if (!content && !audioUrl) return;

    const tempId = -Date.now();

    const optimistic: ChatMsg = {
      messageId: tempId,
      conversationId,
      type: "USER",
      content: content ?? "[Voice Message]",
      audioUrl: audioUrl ?? null,
      createdAt: new Date().toISOString(),
      hiddenMeaning: "",
      visualAction: "",
      situationDescription: "",
    };

    const loadingBubble: ChatMsg = {
      messageId: tempId - 1,
      conversationId,
      type: "AI",
      content: "",
      audioUrl: null,
      createdAt: new Date().toISOString(),
      isLoading: true,
      hiddenMeaning: "",
      visualAction: "",
      situationDescription: "",
    };

    setOptimisticMessages([optimistic, loadingBubble]);

    try {
      await sendMutation({ conversationId, content, audioUrl });

      // Optimistic 메시지 제거
      setOptimisticMessages([]);

      // 서버에서 최신 메시지 목록 다시 가져오기
      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
      });
    } catch (err) {
      console.error("sendMessage error", err);
      setOptimisticMessages([]);
    }
  };

  const [feedbackOpenId, setFeedbackOpenId] = useState<number | null>(null);

  const handleFeedbacks = (messageId: number) => {
    if (feedbackOpenId === messageId) {
      setFeedbackOpenId(null);
      return;
    }

    const targetMessage = messages.find((m) => m.messageId === messageId);
    if (targetMessage?.feedback) {
      setFeedbackOpenId(messageId);
      return;
    }

    createFeedback(String(messageId), {
      onSuccess: () => {
        setFeedbackOpenId(messageId);
      },
    });
  };

  return {
    messages,
    isMessagesLoading,
    sendMessage,
    isAIResponding,
    feedbackOpenId,
    handleFeedbacks,
    isSending: isPending,
  };
}
