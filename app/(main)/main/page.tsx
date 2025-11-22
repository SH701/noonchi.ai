"use client";

import Image from "next/image";
import MainPage from "@/components/main/main";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuthStore } from "@/app/store/auth";

export default function Main() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const { data: profile, isLoading, error } = useUserProfile(accessToken);

  if (isLoading)
    return <p className="text-center py-10 text-gray-500">Loading…</p>;

  if (error)
    return (
      <p className="text-red-500 text-center py-10">로그인이 필요합니다.</p>
    );

  if (!profile)
    return (
      <>
        <div className="w-full py-6 px-7  ">
          <Image
            src="/etc/mainLogo.png"
            width={112}
            height={24}
            alt="Main Logo"
          />
        </div>
        <MainPage />
      </>
    );

  return (
    <>
      <div className="w-full py-6 px-7 ">
        <Image
          src="/etc/mainLogo.png"
          width={112}
          height={24}
          alt="Main Logo"
        />
      </div>
      <MainPage />
    </>
  );
}
