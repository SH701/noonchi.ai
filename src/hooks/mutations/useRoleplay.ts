import { apiMutations } from "@/api/mutations";
import { RoleplayApiRequest } from "@/types/conversations";
import { useMutation } from "@tanstack/react-query";

export const useCreateRoleplay = () => {
  return useMutation({
    mutationFn: async (data: RoleplayApiRequest) => {
      return apiMutations.conversations.createRoleplay(data);
    },
  });
};
