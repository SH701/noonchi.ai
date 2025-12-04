import { useMutation } from "@tanstack/react-query";

export function useGuestLogin() {
  return useMutation({
    mutationFn: async (deviceId: string) => {
      const res = await fetch(`/api/auth/guest-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
      });

      if (!res.ok) {
        throw new Error(`Guest 로그인 실패: ${res.status}`);
      }

      const data = await res.json();
      return data.accessToken;
    },
  });
}
