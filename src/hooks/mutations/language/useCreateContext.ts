import { apiMutations } from "@/api";
import { useMutation } from "@tanstack/react-query";

export const useCreateContext = (scenarioId: number) => {
  return useMutation({
    mutationFn: () => apiMutations.language.createcontext(scenarioId),
  });
};
