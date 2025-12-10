import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/useAuth";
import { Profile } from "@/types/user";
import { apiFetch } from "@/lib/api/api";

export const useUserProfile = () => {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery<Profile>({
    queryKey: ["userProfile"],
    enabled: !!accessToken,

    queryFn: () => apiFetch<Profile>("/api/users/me"),
    staleTime: 1000 * 60 * 5,
  });
};
