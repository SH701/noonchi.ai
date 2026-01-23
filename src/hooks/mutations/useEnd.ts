import { apiFetch } from "@/api";
import { useMutation } from "@tanstack/react-query";

export function useEnd() {
  return useMutation({
    mutationFn: async (conversationId: string) => {
      const res = await apiFetch(`/api/conversations/${conversationId}/end`, {
        method: "PUT",
      });
      return res;
    },
  });
}
