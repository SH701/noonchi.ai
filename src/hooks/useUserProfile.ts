import { useQuery } from "@tanstack/react-query";
import { Profile } from "@/src/types/user";

export const useUserProfile = (accessToken?: string | null) => {
  return useQuery<Profile>({
    queryKey: ["user", accessToken],
    enabled: !!accessToken,
    queryFn: async () => {
      const res = await fetch("/api/users/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to load profile");
      }

      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
};
