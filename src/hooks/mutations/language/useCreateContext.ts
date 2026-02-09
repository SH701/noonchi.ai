import { apiMutations } from "@/api";
import { useMutation } from "@tanstack/react-query";

export const useCreateContext = () => {
  return useMutation({
    mutationFn: () => apiMutations.language.createcontext(),
  });
};
