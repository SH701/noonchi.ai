"use client";

import { ChevronLeftIcon } from "lucide-react";
import Header from "../common/Header";
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
