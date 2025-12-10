"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

import { topicsByCategory } from "@/data/topics";
import RoleplayForm from "@/components/ui/forms/RoleplayForm";
import { apiFetch } from "@/lib/api/api";
import { useState } from "react";
import Loading from "@/app/(main)/main/chatroom/[id]/loading";
import { ConversationResponse } from "@/types/interview";

export const TOPIC_ENUMS = {
  Career: {
    1: "after_work_escape_mode",
  },
  Romance: {
    1: "could_you_soften_your_tone",
  },
  Belonging: {
    1: "midnight_mom_energy",
  },
  "K-POP": {
    1: "bias_talk_irl",
  },
} as const;

export default function RolePlay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const mode = searchParams.get("mode") as "topic" | "custom";
  const category = searchParams.get(
    "category"
  ) as keyof typeof topicsByCategory;
  const topicId = Number(searchParams.get("topicId"));

  const topicEnum =
    TOPIC_ENUMS[category]?.[
      topicId as keyof (typeof TOPIC_ENUMS)[typeof category]
    ];

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
    if (!topicEnum) {
      alert("준비중인 시나리오 입니다!");
      return router.push("/main");
    }

    setLoading(true);

    try {
      const deduct = await apiFetch("/api/users/credit/deduct", {
        method: "POST",
        body: JSON.stringify({ amount: 20 }),
      });

      if (!deduct === true) {
        alert("크레딧이 부족합니다.");
        setLoading(false);
        return;
      }

      const convo = await apiFetch<ConversationResponse>(
        "/api/conversations/role-playing",
        {
          method: "POST",
          body: JSON.stringify({
            conversationTopic: topicEnum,
            details: data.detail,
          }),
        }
      );

      if (!convo || !convo.conversationId) {
        throw new Error("대화 생성 실패");
      }

      setLoading(false);
      router.push(`/main/chatroom/${convo.conversationId}`);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
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
