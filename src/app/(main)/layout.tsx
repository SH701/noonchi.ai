"use client";

import TabBar from "@/components/ui/tab-bar/tab-bar";
import { useUser } from "@/hooks/queries/useUser";

import { usePathname, useRouter } from "next/navigation";

export default function MainsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const hide = [
    "/main/create",
    "/main/role",
    "/main/honorific",
    "/main/chatroom",
  ];
  const hideTabbar = hide.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  const { isError, error } = useUser();
  if (isError) {
    const status = Number(error.message);
    if (status === 401 || status === 403) {
      router.push("/login");
      return null;
    }
  }
  return (
    <div className="w-full min-h-screen flex flex-col ">
      {children}
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
