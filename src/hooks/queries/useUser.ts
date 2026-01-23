import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/client";

import { User } from "@/types/user/user.type";
import { useUserStore } from "@/store/user/useUsersStore";

export const useUser = () => {
  const setUser = useUserStore((s) => s.setUser);

  return useQuery<User>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const profile = await apiClient.users.getMe();
      setUser(profile);
      return profile;
    },
    staleTime: 1000 * 60 * 5,
  });
};
