"use client";

import { Header } from "@/components/common";
import { LANGUAGE_OPTIONS } from "@/constants/language";

import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MyLanguage() {
  const router = useRouter();
  return (
    <div>
      <Header
        center="Language"
        rightIcon={<XIcon onClick={() => router.back()} />}
      />
      <div className="bg-white rounded-2xl p-4 flex flex-col gap-2">
        <div className="flex justify-between font-medium">
          <span>Language</span>
          <select name="language" id="language" defaultValue="EN">
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <span className="text-gray-500 text-[13px]">
          Once you select a language, it will be automatically applied to all
          features and services.
        </span>
      </div>
    </div>
  );
}
