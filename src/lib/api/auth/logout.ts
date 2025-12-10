"use client";

import { useAuthStore } from "@/store/useAuth";

export function logout() {
  const cookiesToClear = [
    "__clerk_db_jwt",
    "__client_uat",
    "__session",
    "accessToken",
    "refreshToken",
  ];

  cookiesToClear.forEach((name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  });

  useAuthStore.getState().logout();
  localStorage.removeItem("auth-store");
  localStorage.removeItem("device_id");
}
