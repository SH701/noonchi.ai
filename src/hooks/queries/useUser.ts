import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth/useAuth";
import { apiFetch } from "@/lib/api/api";
import { useUserStore } from "@/store";
import { User } from "@/types/user.type";

export const useUser = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setUser = useUserStore((s) => s.setUser);

  return useQuery<User>({
    queryKey: ["userProfile"],
    enabled: !!accessToken,

    queryFn: async () => {
      const profile = await apiFetch<User>("/api/users/me");
      setUser(profile);
      return profile;
    },
    staleTime: 1000 * 60 * 5,
  });
};
