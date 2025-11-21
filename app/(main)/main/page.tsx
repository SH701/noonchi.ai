"use client";

import Image from "next/image";
import MainPage from "@/components/main/main";
import { useAuth } from "@/lib/UserContext";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function Main() {
  const { accessToken } = useAuth();

  const { data: profile, isLoading, error } = useUserProfile(accessToken);

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p className="text-red-500">로그인이 필요합니다.</p>;
  if (!profile) return null;

  return (
    <div
      className="min-h-screen flex flex-col w-[375px] overflow-x-hidden overflow-y-auto"
      style={{ paddingBottom: "calc(153px + env(safe-area-inset-bottom))" }}
    >
      <div className="w-full py-6 px-7 text-white">
        <Image
          src="/etc/mainLogo.png"
          width={112}
          height={24}
          alt="Main Logo"
        />
      </div>

      <MainPage />
    </div>
  );
}
