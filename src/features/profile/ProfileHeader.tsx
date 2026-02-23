"use client";

import { ChevronLeftIcon } from "@/assets/svgr";
import { Header } from "@/components/common";


import { useRouter } from "next/navigation";

export default function ProfileHeader() {
  const router = useRouter();
  return (
    <Header
      leftIcon={<ChevronLeftIcon onClick={() => router.back()} />}
      center="My Page"
    />
  );
}
