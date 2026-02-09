import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
export const useTopics = (category: string, favoritesOnly: boolean) => {
  return useQuery({
    queryKey: ["topics", category, favoritesOnly],
    queryFn: () => apiClient.topic.getTopic(category, favoritesOnly),

    enabled: !!category,
  });
};
