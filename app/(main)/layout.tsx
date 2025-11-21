"use client";

import TabBar from "@/components/etc/tab-bar";
import { usePathname } from "next/navigation";

export const dynamic = "force-dynamic";

export default function MainsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hide = ["/main/custom", "/main/role", "/main/honorific"];
  const hideTabbar = hide.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="min-h-screen flex flex-col max-w-[375px]  overflow-y-auto">
        {children}
      </div>
      {!hideTabbar && (
        <div className="fixed bottom-0 inset-x-0 z-50">
          <TabBar />
        </div>
      )}
    </div>
  );
}
