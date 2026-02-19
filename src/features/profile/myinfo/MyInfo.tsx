"use client";

import { Header } from "@/components/common";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface MyInfoProps {
  name: string;
  age: number;
}

export default function MyInfo({ name, age }: MyInfoProps) {
  const router = useRouter();
  return (
    <div>
      <Header
        center="My Profile"
        rightIcon={<XIcon onClick={() => router.back()} />}
      />
      <div className="bg-white rounded-2xl p-4 flex flex-col gap-4 text-sm  ">
        <div className="flex justify-between">
          <span>Name</span>
          <span>{name}</span>
        </div>
        <div className="flex justify-between">
          <span>Age</span>
          <span>{age}</span>
        </div>
      </div>
    </div>
  );
}
