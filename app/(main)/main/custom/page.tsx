"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

import type { Persona } from "@/lib/types";
import Loading from "./chatroom/[id]/loading";
import InterviewForm from "@/components/forms/InterviewForm";
import { useAuthStore } from "@/store/auth";

const INTERVIEW_STYLES = [
  { value: "friendly", label: "Friendly" },
  { value: "standard", label: "Standard" },
  { value: "strict", label: "Strict" },
] as const;

const DEFAULT_INTERVIEWER_IMAGE = "/characters/interviewer.png";

export default function PersonaAndRoom() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const router = useRouter();

  const [showLoading, setShowLoading] = useState(false);

  const handleSubmit = async (formData: {
    company: string;
    position: string;
    jobPosting: string;
    style: string;
  }) => {
    setShowLoading(true);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      // 면접관 페르소나 생성
      const personaRes = await fetch("/api/personas", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: `${formData.company} Interviewer`,
          company: formData.company,
          position: formData.position,
          jobPosting: formData.jobPosting,
          interviewStyle: formData.style,
          role: "INTERVIEWER",
          profileImageUrl: DEFAULT_INTERVIEWER_IMAGE,
        }),
      });

      if (!personaRes.ok) throw new Error("면접관 생성 실패");
      const persona: Persona = await personaRes.json();

      // 면접 대화방 생성
      const convoRes = await fetch("/api/conversations", {
        method: "POST",
        headers,
        body: JSON.stringify({
          personaId: persona.personaId,
          conversationType: "INTERVIEW",
          interviewStyle: formData.style,
        }),
      });

      if (!convoRes.ok) throw new Error("면접방 생성 실패");
      const convo = await convoRes.json();

      setTimeout(() => {
        router.push(`/main/custom/chatroom/${convo.conversationId}`);
      }, 1500);
    } catch {
      alert("생성 실패");
      setShowLoading(false);
    }
  };

  if (showLoading) {
    return <Loading />;
  }

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
          Create Interview
        </h1>
      </div>
      <h2 className="text-left text-xl font-bold mb-12 pl-5 mt-6">
        Interview Preparation
      </h2>

      <div className="w-full flex justify-center">
        <div className="w-full max-w-[375px] px-5">
          <InterviewForm
            interviewStyles={INTERVIEW_STYLES}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
