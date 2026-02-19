"use client";

import { Header } from "@/components/common";
import { ChevronLeftIcon } from "lucide-react";

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
