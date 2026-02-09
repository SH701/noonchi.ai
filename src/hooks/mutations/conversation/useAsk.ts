import { apiMutations } from "@/api";
import { AskAPiRequest } from "@/types/conversations/ask/ask.type";
import { useMutation } from "@tanstack/react-query";

export const useAsk = () => {
  return useMutation({
    mutationFn: async (data: AskAPiRequest) => {
      return apiMutations.conversations.createAsk(data);
    },
  });
};
