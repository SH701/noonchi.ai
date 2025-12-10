"use client";

import Onboard from "@/components/onboard/onboard";
import { useAuthStore } from "@/store";

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
    <main className="h-screen w-full max-w-[375px] mx-auto flex items-center justify-center overflow-hidden">
      <Onboard />
    </main>
  );
}
