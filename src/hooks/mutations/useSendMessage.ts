import { apiMutations } from "@/api/mutations";
import { useMutation } from "@tanstack/react-query";

export function useSendMessage() {
  return useMutation({
    mutationFn: apiMutations.messages.send,
  });
}
