"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import Loading from "@/app/(main)/main/chatroom/[id]/loading";
import RoleplayForm from "@/components/ui/forms/RoleplayForm";
import UserCharge from "../modal/UserCharge";
import GuestCharge from "../modal/GuestCharge";

import { topicsByCategory } from "@/data/topics";

import { TOPIC_ENUMS } from "@/types/conversations";

import { useCreateRoleplay } from "@/hooks/mutations/useRoleplay";
import { useUser } from "@/hooks/queries/useUser";
import { useDeductCredit } from "@/hooks/mutations/useCredit";

export default function RolePlay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const [needCharge, setNeedCharge] = useState(false);

  const mode = searchParams.get("mode") as "topic" | "custom";
  const category = searchParams.get(
    "category"
  ) as keyof typeof topicsByCategory;
  const topicId = Number(searchParams.get("topicId"));

  const topic =
    category && topicId
      ? topicsByCategory[category]?.find((t) => t.id === topicId)
      : undefined;

  const deductCredit = useDeductCredit();
  const createRoleplay = useCreateRoleplay();
  const loading = deductCredit.isPending || createRoleplay.isPending;

  const handleSubmit = async ({ details }: { details: string }) => {
    try {
      await deductCredit.mutateAsync(20);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });

      const conversationTopic = TOPIC_ENUMS[category][1];

      const convo = await createRoleplay.mutateAsync({
        conversationTopic,
        details: details,
      });

      router.push(`/main/chatroom/${convo.conversationId}`);
    } catch (error) {
      if (deductCredit.isError) {
        setNeedCharge(true);
        return;
      }

      console.error("채팅 생성 실패:", error);
      alert("채팅 생성 실패 🤯");
    }
  };

  if (loading) return <Loading />;

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
        <div className="w-full max-w-93.75 px-5">
          <RoleplayForm
            AiRole={topic?.aiRole}
            myRole={topic?.myRole}
            onSubmit={handleSubmit}
            mode={mode}
          />
        </div>
      </div>

      {needCharge &&
        (user?.role === "ROLE_USER" ? (
          <UserCharge isOpen={true} onClose={() => setNeedCharge(false)} />
        ) : (
          <GuestCharge isOpen={true} onClose={() => setNeedCharge(false)} />
        ))}
    </div>
  );
}
