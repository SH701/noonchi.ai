"use client";

import { useUser } from "@/hooks/queries";

export function Providers({ children }: { children: React.ReactNode }) {
  useUser();

  return <>{children}</>;
}
