"use client";

import { useUserStore } from "@/store/users/useUsers";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    async function loadMe() {
      try {
        const res = await fetch("/api/users/me", { cache: "no-store" });
        if (res.ok) {
          setUser(await res.json());
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadMe();
  }, []);

  return <>{children}</>;
}
