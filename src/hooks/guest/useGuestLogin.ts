import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/api";

export function useGuestLogin() {
  return useMutation({
    mutationFn: async (deviceId: string) => {
      try {
        const data = await apiFetch<{ accessToken: string }>(
          `/api/auth/guest-login`,
          {
            method: "POST",
            body: JSON.stringify({ deviceId }),
          }
        );

        return data.accessToken;
      } catch (error) {
        console.error("Guest 로그인 실패:", error);
        throw error;
      }
    },
  });
}
