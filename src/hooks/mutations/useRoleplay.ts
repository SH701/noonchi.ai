import { apiMutations } from "@/lib/api/mutations";
import { RoleplayApiRequest } from "@/types/conversations/role-playing/roleplay.type";
import { useMutation } from "@tanstack/react-query";

export const useCreateRoleplay = () => {
  return useMutation({
    mutationFn: async (data: RoleplayApiRequest) => {
      return apiMutations.conversations.createRoleplay(data);
    },
  });
};
