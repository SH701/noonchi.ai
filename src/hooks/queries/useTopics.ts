import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
export const useTopics = (category: string, favoritesOnly: boolean) => {
  return useQuery({
    queryKey: ["topics", category, favoritesOnly],
    queryFn: () => apiClient.topic.getTopic(category, favoritesOnly),

    enabled: true,
  });
};
export const useRecentTopics = (page: number = 1, size: number = 20) => {
  return useQuery({
    queryKey: ["recentTopics", page, size],
    queryFn: () => apiClient.topic.getRecentTopic(page, size),
  });
};
