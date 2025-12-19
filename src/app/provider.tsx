"use client";

import { useUser } from "@/hooks/queries/useUser";

export function Providers({ children }: { children: React.ReactNode }) {
  useUser();

  return <>{children}</>;
}
