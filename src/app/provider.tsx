"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuth";

export function Providers({ children }: { children: React.ReactNode }) {
  const setMe = useAuthStore((s) => s.setMe);

  useEffect(() => {
    async function loadMe() {
      try {
        const res = await fetch("/api/users/me", { cache: "no-store" });
        if (res.ok) {
          setMe(await res.json());
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadMe();
  }, []);

  return <>{children}</>;
}
