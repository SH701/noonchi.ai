"use client";

import { useRouter } from "next/navigation";

import { useUserProfile } from "@/hooks/user/useUserProfile";
import { useAuthStore } from "@/store/useAuth";
import {
  ProfileHeader,
  ProfileImage,
  ProfileMenuList,
  StatsCard,
} from "@/components/profile";
import dynamic from "next/dynamic";
const LoginModal = dynamic(import("@/components/modal/LoginModal"), {
  ssr: false,
});

export default function ProfilePage() {
  const router = useRouter();
  const { data: profile, isLoading } = useUserProfile();

  const handleLogout = async () => {
    const { refreshToken } = useAuthStore.getState();

    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ refreshToken }),
    });

    const cookies = [
      "__clerk_db_jwt",
      "__client_uat",
      "__session",
      "accessToken",
      "refreshToken",
    ];
    cookies.forEach(
      (name) =>
        (document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`)
    );
    useAuthStore.getState().logout();
    localStorage.removeItem("auth-store");
    localStorage.removeItem("device_id");
    router.push("/login");
  };
  if (profile?.role === "ROLE_GUEST") {
    return <LoginModal isOpen={true} onClose={() => router.push("/login")} />;
  }

  if (isLoading) return <p className="text-center mt-10">Loading…</p>;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ProfileHeader />

      <div className="flex-1 flex flex-col items-center w-[375px] mx-auto">
        <div className="flex flex-col items-center pt-6">
          <ProfileImage src={profile?.profileImageUrl} />

          <button
            onClick={() => router.push("/profile/edit")}
            className="text-xl font-semibold mt-4"
          >
            {profile?.nickname}
          </button>
        </div>

        <div className="px-4 pt-6 w-full">
          <StatsCard
            sentenceCount={profile?.sentenceCount}
            koreanLevel={profile?.koreanLevel}
          />
        </div>

        <div className="px-4 pt-6 w-full">
          <ProfileMenuList />
        </div>

        <div className="px-4 pt-6 pb-6 w-full">
          <button
            onClick={handleLogout}
            className="w-full py-4 text-gray-600 text-base underline"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
