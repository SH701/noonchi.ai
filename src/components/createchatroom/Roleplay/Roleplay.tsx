"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import RoleplayForm from "@/components/createchatroom/Roleplay/RoleplayForm";

import { topicsByCategory } from "@/data";

import { TOPIC_ENUMS } from "@/types/conversations";

import { useCreateRoleplay, useDeductCredit } from "@/hooks/mutations";

export default function RolePlay() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode") as "topic" | "custom";
  const category = searchParams.get(
    "category",
  ) as keyof typeof topicsByCategory;
  const topicId = Number(searchParams.get("topicId"));

  const topic =
    category && topicId
      ? topicsByCategory[category]?.find((t) => t.id === topicId)
      : undefined;

  const deductCredit = useDeductCredit();
  const createRoleplay = useCreateRoleplay();

  const handleSubmit = async ({ details }: { details: string }) => {
    try {
      const conversationTopic = TOPIC_ENUMS[category][1];

      const convo = await createRoleplay.mutateAsync({
        conversationTopic,
        details: details,
      });

      router.push(`/main/chatroom/${convo.conversationId}`);
    } catch {
      if (deductCredit.isError) {
        return;
      }
      alert("채팅 생성 실패 🤯");
    }
  };

  return (
    <div className="flex flex-col relative w-full overflow-x-hidden">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-93.75 ">
          <div className="relative w-full aspect-square max-w-83.75 mx-auto">
            <Image
              src={topic?.img || "/default-image.jpg"}
              alt="topic's photo"
              fill
              className="object-cover rounded-3xl"
            />
            <div className="" />
            <div className="absolute top-4 left-4">
              <span className="text-gray-600 px-3 py-2 bg-white/50 text-sm  rounded-3xl border border-gray-200">
                {topic?.topic}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-auto bg-gray backdrop-blur-sm rounded-b-3xl flex flex-col p-4 text-white">
              <span className="text-3xl font-semibold">{topic?.title}</span>
              <span className="text-sm font-medium">{topic?.description}</span>
            </div>
          </div>
          <div>
            <p className="font-semibold pb-5 pt-8">Conversation Context</p>
            <RoleplayForm
              AiRole={topic?.aiRole}
              myRole={topic?.myRole}
              onSubmit={handleSubmit}
              mode={mode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
