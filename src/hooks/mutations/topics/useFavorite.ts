import { apiMutations } from "@/api";
import { toast } from "@/components/ui/toast/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (topicId: number) => apiMutations.topic.addfavorite(topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      toast.success("Added to favorites!");
    },
  });
};
export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (topicId: number) => apiMutations.topic.removefavorite(topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      toast.success("Removed from favorites!");
    },
  });
};
