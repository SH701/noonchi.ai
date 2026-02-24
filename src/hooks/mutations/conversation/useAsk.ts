import { apiMutations } from "@/api";
import { AskReq } from "@/types/conversations";
import { useMutation } from "@tanstack/react-query";

export const useAsk = () => {
  return useMutation({
    mutationFn: async (data: AskReq) => {
      return apiMutations.conversations.createAsk(data);
    },
  });
};
