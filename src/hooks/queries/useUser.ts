import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth/useAuth";
import { apiClient } from "@/api/client";
import { useUserStore } from "@/store";
import { User } from "@/types/user/user.type";

export const useUser = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setUser = useUserStore((s) => s.setUser);

  return useQuery<User>({
    queryKey: ["userProfile"],
    enabled: !!accessToken,

    queryFn: async () => {
      const profile = await apiClient.users.getMe();
      setUser(profile);
      return profile;
    },
    staleTime: 1000 * 60 * 5,
  });
};
