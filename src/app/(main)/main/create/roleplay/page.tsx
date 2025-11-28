"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import Loading from "../../chatroom/[id]/loading";
import { useAuthStore } from "@/store/auth";

import RoleplayForm from "@/components/forms/RoleplayForm";

export default function RolePlay() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const router = useRouter();

  return (
    <div className="flex flex-col pt-14 relative bg-white w-full overflow-x-hidden">
      <div className="flex items-center w-full px-4">
        <button
          onClick={() => router.back()}
          className="text-black cursor-pointer"
        >
          <ChevronLeftIcon className="size-6" />
        </button>
        <h1 className="flex-1 text-center font-semibold text-black text-lg">
          Create
        </h1>
      </div>
      <h2 className="text-left text-xl font-bold mb-12 pl-5 mt-6">
        Role-Playing
      </h2>

      <div className="w-full flex justify-center">
        <div className="w-full max-w-[375px] px-5">
          <RoleplayForm
            onSubmit={(data) => {
              //채팅방으로 이동
            }}
          />
        </div>
      </div>
    </div>
  );
}
