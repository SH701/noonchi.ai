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
    <div className="w-full min-h-screen flex flex-col bg-gray-100">
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
