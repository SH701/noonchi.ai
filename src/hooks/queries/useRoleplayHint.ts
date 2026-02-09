import { apiClient } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useRoleplayHint = (conversationId?: number) => {
  return useQuery({
    queryKey: ["roleplayHint", conversationId],
    queryFn: async () => {
      return apiClient.language.getHint(conversationId!);
    },
    enabled: !!conversationId,
  });
};
