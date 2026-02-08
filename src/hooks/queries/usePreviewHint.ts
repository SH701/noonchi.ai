import { apiClient } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const usePreviewHint = (sessionId?: string) => {
  return useQuery({
    queryKey: ["previewHint", sessionId],
    queryFn: async () => {
      return apiClient.preview.getHint(sessionId!);
    },
    enabled: !!sessionId,
  });
};
