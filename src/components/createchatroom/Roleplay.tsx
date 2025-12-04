"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

import { topicsByCategory } from "@/data/topics";
import RoleplayForm from "@/components/ui/forms/RoleplayForm";
import { apiFetch } from "@/lib/api";
const TOPIC_ENUM_BY_ID: Record<number, string> = {
  1: "after_work_escape_mode",
  2: "could_you_soften_your_tone",
  3: "midnight_mom_energy",
  4: "bias_talk_irl",
};
export default function RolePlay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") as "topic" | "custom";
  const category = searchParams.get(
    "category"
  ) as keyof typeof topicsByCategory;
  const topicId = Number(searchParams.get("topicId"));

  const topic =
    category && topicId
      ? topicsByCategory[category]?.find((t) => t.id === topicId)
      : undefined;

  const handleSubmit = async (data: {
    isAI: string;
    me: string;
    detail: string;
  }) => {
    if (!topic) return;

    try {
      const topicEnum = TOPIC_ENUM_BY_ID[topicId];
      const deduct = await apiFetch("/api/users/credit/deduct", {
        method: "POST",
        body: JSON.stringify({
          amount: 20,
        }),
      });

      if (!deduct.ok) throw new Error("크레딧 부족");
      const res = await apiFetch(`/api/conversations/role-playing`, {
        method: "POST",
        body: JSON.stringify({
          conversationTopic: topicEnum,
          details: data.detail,
        }),
      });
      if (!res.ok) throw new Error("인터뷰 생성 실패");
      const convo = await res.json();

      router.push(`/main/chatroom/${convo.conversationId}`);
    } catch (err) {
      console.error("Error:", err);
    }
  };

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
            AiRole={topic?.aiRole}
            myRole={topic?.myRole}
            onSubmit={handleSubmit}
            mode={mode}
          />
        </div>
      </div>
    </div>
  );
}
