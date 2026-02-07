import { apiClient } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const usePrevieHint = (sessionId: string) => {
  return useQuery({
    queryKey: [sessionId],
    queryFn: async () => {
      apiClient.preview.getHint(sessionId);
    },
  });
};
