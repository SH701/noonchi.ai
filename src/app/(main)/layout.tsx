"use client";

import TabBar from "@/components/tab-bar/tab-bar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuthStore } from "@/store/auth";
import { usePathname, useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function MainsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const hide = ["/main/create", "/main/role", "/main/honorific"];
  const hideTabbar = hide.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
  const { accessToken } = useAuthStore();
  const { isError, error } = useUserProfile(accessToken);
  if (isError) {
    const status = Number(error.message);
    if (status === 401 || status === 403) {
      router.push("/login");
      return null;
    }
  }
  return (
    <div className="w-full min-h-screen flex flex-col ">
      <div className="w-full min-h-screen md:flex md:justify-center">
        <div className="w-full md:max-w-[375px] md:shadow-xl bg-white">
          {children}
        </div>
      </div>
      {!hideTabbar && (
        <div className="fixed bottom-0 left-0 w-full md:flex md:justify-center z-50">
          <div className="w-full md:max-w-[375px] md:shadow-xl">
            <TabBar />
          </div>
        </div>
      )}
    </div>
  );
}
// const accessToken = useAuthStore((s) => s.accessToken);
// const role = useAuthStore((s) => s.role);
// const hasHydrated = useAuthStore.persist.hasHydrated();
// useEffect(() => {
//   if (!hasHydrated) return; // localStorage 로드 전에는 판단하지 않음

//   const invalid = !accessToken || role === "ROLE_GUEST";

//   if (invalid) {
//     router.replace("/login");
//   }
// }, [hasHydrated, accessToken, role]);

// if (!hasHydrated) return null; // 초기 깜빡임 방지
// if (!accessToken || role === "ROLE_GUEST") return null;
