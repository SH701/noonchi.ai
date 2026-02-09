"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import RoleplayForm from "@/components/createchatroom/Roleplay/RoleplayForm";

import { useCreateRoleplay } from "@/hooks/mutations";
import { toast } from "@/components/ui/toast/toast";
import { useTopics } from "@/hooks/queries/useTopics";

interface SubmitProps {
  myRole: string;
  aiRole: string;
  situation: string;
  tone: string;
}

export default function RolePlay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") as "topic" | "custom";
  const category = searchParams.get("category") ?? "";
  const topicId = Number(searchParams.get("topicId"));

  const { data: topics = [], isLoading } = useTopics(category, false);
  const topic = topics.find((t) => t.topicId === topicId);

  const createRoleplay = useCreateRoleplay();

  if (isLoading || !topic) {
    return <div>loading...</div>;
  }

  const handleSubmit = async ({
    myRole,
    aiRole,
    situation,
    tone,
  }: SubmitProps) => {
    try {
      const requestData = {
        conversationTopicId: topicId,
        userRole: myRole,
        aiRole,
        closeness: tone || "casual",
        situation,
      };
      const convo = await createRoleplay.mutateAsync(requestData);
      router.push(`/main/roleplay/chatroom/${convo.conversationId}`);
    } catch {
      toast.error("Failed to create chat room");
    }
  };

  return (
    <div className="flex flex-col relative w-full overflow-x-hidden">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-93.75 ">
          <div className="relative w-full aspect-square max-w-83.75 mx-auto">
            <Image
              src={topic.imageUrl}
              alt="topic's photo"
              fill
              className="object-cover rounded-3xl"
            />
            <div className="" />
            <div className="absolute top-4 left-4">
              <span className="text-gray-600 px-3 py-2 bg-white/50 text-sm  rounded-3xl border border-gray-200">
                {topic?.category}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-auto bg-gray backdrop-blur-sm rounded-b-3xl flex flex-col p-4 text-white">
              <span className="text-3xl font-semibold">{topic?.name}</span>
              <span className="text-sm font-medium">{topic?.description}</span>
            </div>
          </div>
          <div>
            <p className="font-semibold pb-5 pt-8">Conversation Context</p>
            <RoleplayForm
              onSubmit={handleSubmit}
              mode={mode}
              topicId={topicId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
