import { apiClient } from "@/api/client";
import { apiMutations } from "@/api/mutations";

import { useMutation, useQuery } from "@tanstack/react-query";

export function useMessageFeedback(messageId?: string) {
  return useQuery({
    queryKey: ["feedback", messageId],
    queryFn: () => apiClient.messages.getFeedback(messageId!),
    enabled: !!messageId,
  });
}

export function useMessageTTS() {
  return useMutation({
    mutationFn: (messageId: string) =>
      apiMutations.messages.tts(Number(messageId)),
  });
}

export function useMessageTranslate() {
  return useMutation({
    mutationFn: (messageId: string) =>
      apiMutations.messages.translate(Number(messageId)),
  });
}
