"use client";

import { useState } from "react";
import { Header } from "@/components/common";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { INTEREST_OPTIONS } from "@/data";
import { useSession } from "next-auth/react";

export default function MyInterest() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(
    session?.user?.interests ?? [],
  );

  const toggle = (opt: string) => {
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt],
    );
  };

  return (
    <div>
      <Header
        center="Topic of Interest"
        rightIcon={<XIcon onClick={() => router.back()} />}
      />

      <div className="flex flex-wrap gap-3">
        {INTEREST_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className="flex items-center text-sm font-medium border p-3 rounded-full cursor-pointer"
            style={{
              borderColor: selected.includes(opt) ? "#316CEC" : "#E5E7EB",
              background: selected.includes(opt) ? "#EFF6FF" : "#FFFFFF",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
