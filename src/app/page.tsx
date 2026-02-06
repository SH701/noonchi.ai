"use client";

import Onboard from "@/components/onboard/Onboard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.accessToken) {
      router.push("/main");
    }
  }, [session, router]);

  return (
    <main className="h-screen w-full max-w-93.75 mx-auto flex items-center justify-center overflow-hidden">
      <Onboard />
    </main>
  );
}
