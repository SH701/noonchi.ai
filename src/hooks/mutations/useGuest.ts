import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/api";
import { AuthResponse } from "@/types/auth";


export function useGuest() {
  return useMutation({
    mutationFn: async (deviceId: string) => {
      try {
        const data = await apiFetch<AuthResponse>(`/api/auth/guest-login`, {
          method: "POST",
          body: JSON.stringify({ deviceId }),
        });

        return data;
      } catch (error) {
        console.error("Guest 로그인 실패:", error);
        throw error;
      }
    },
  });
}
