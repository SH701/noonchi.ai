import { apiMutations } from "@/api/mutations";
import { RoleplayReq } from "@/types/conversations";
import { useMutation } from "@tanstack/react-query";

export const useCreateRoleplay = () => {
  return useMutation({
    mutationFn: async (data: RoleplayReq) => {
      return apiMutations.conversations.createRoleplay(data);
    },
  });
};
