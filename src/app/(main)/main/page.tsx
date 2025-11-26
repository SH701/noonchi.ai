"use client";

import Image from "next/image";
import MainPage from "@/components/main/main";

export default function Main() {
  return (
    <>
      <div className="w-full py-6 px-7 bg-white">
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
