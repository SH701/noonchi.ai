// hooks/user/useUserProfile.ts
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/useAuth";
import { Profile } from "@/types/user";

export const useUserProfile = () => {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery<Profile>({
    queryKey: ["userProfile"],
    enabled: !!accessToken,

    queryFn: async () => {
      const res = await apiFetch("/api/users/me");

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to load profile");
      }

      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
};
