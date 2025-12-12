import { apiFetch } from "@/lib/api/api";
import { ConversationResponse } from "@/types/conversations/conversations.type";
import { RoleplayApiRequest } from "@/types/conversations/role-playing/roleplay.type";
import { useMutation } from "@tanstack/react-query";

export const useDeductCredit = () => {
  return useMutation({
    mutationFn: async (amount: number) => {
      return apiFetch<void>("api/users/credit/deduct", {
        method: "POST",
        body: JSON.stringify({ amount }),
      });
    },
  });
};
export const useCreateRoleplay = () => {
  return useMutation({
    mutationFn: async (data: RoleplayApiRequest) => {
      return apiFetch<ConversationResponse>("/api/conversations/role-playing", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  });
};
