"use client";

import Onboard from "@/components/onboard/Onboard";
import { useAuthStore } from "@/store/auth/useAuth";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { accessToken } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (accessToken) {
      router.push("/main");
    }
  }, [accessToken, router]);

  return (
    <main className="h-screen w-full max-w-93.75 mx-auto flex items-center justify-center overflow-hidden">
      <Onboard />
    </main>
  );
}
