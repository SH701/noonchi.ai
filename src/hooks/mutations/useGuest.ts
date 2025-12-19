import { useMutation } from "@tanstack/react-query";
import { apiMutations } from "@/lib/api/mutations";

export function useGuest() {
  return useMutation({
    mutationFn: async (deviceId: string) => {
      try {
        return await apiMutations.auth.guestLogin(deviceId);
      } catch (error) {
        console.error("Guest 로그인 실패:", error);
        throw error;
      }
    },
  });
}
