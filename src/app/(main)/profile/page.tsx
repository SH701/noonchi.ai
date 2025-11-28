"use client";

import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuthStore } from "@/store/auth";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileImage from "@/components/ui/image/ProfileImage";
import StatsCard from "@/components/profile/StatsCard";
import ProfileMenuList from "@/components/profile/ProfileMenuList";

export default function ProfilePage() {
  const router = useRouter();

  const accessToken = useAuthStore((s) => s.accessToken);
  const { data: profile, isLoading } = useUserProfile(accessToken);

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
    localStorage.removeItem("auth-storage");
    router.push("/login");
  };

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
            koreanLevel={Number(profile?.koreanLevel)}
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
