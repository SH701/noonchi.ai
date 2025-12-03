"use client";

import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function Back() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="text-gray-800 hover:text-gray-900 transition-colors cursor-pointer"
    >
      <ChevronLeftIcon className="w-6 h-6" />
    </button>
  );
}
