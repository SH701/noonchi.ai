import { useMemo, useState } from "react";
import { apiMutations } from "@/api";
import { ChatMsg } from "@/types/messages";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useChatQuery } from "@/hooks/queries/useChatQuery";

export function useRoleplayMessages(conversationId?: number) {
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMsg[]>([]);
  const queryClient = useQueryClient();

  const { data: serverMessages = [] } = useChatQuery(conversationId);

  const { mutateAsync: sendMutation, isPending } = useMutation({
    mutationFn: (params: {
      conversationId: number;
      content?: string;
      audioUrl?: string;
    }) =>
      apiMutations.messages.roleplaysend(
        params.conversationId,
        params.content,
        params.audioUrl,
      ),
  });

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

      setOptimisticMessages([]);

      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversationDetail"],
      });
    } catch (err) {
      console.error("sendMessage error", err);
      setOptimisticMessages([]);
    }
  };

  return {
    messages,
    sendMessage,
    isAIResponding,

    isSending: isPending,
  };
}
