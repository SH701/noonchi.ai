"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import Loading from "../../chatroom/[id]/loading";

import { apiFetch } from "@/lib/api";
import InterviewForm from "@/components/ui/forms/InterviewForm";
import { useQueryClient } from "@tanstack/react-query";

const INTERVIEW_STYLES = [
  { value: "friendly", label: "Friendly" },
  { value: "standard", label: "Standard" },
  { value: "strict", label: "Strict" },
] as const;

export type UploadedFiles = File[];

export default function Interview() {
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);
  const queryClient = useQueryClient();
  const handleSubmit = async (data: any) => {
    setTimeout(() => setShowLoading(true), 0);

    try {
      const uploadedFiles = await Promise.all(
        data.files.map(async (file: File) => {
          const presignRes = await apiFetch("/api/files/presigned-url", {
            method: "POST",
            body: JSON.stringify({
              fileExtension: file.name.split(".").pop(),
              fileType: file.type,
            }),
          });

          const { url } = await presignRes.json();

          await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });

          return {
            fileUrl: url.split("?")[0],
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
          };
        })
      );
      const deduct = await apiFetch("/api/users/credit/deduct", {
        method: "POST",
        body: JSON.stringify({
          amount: 60,
        }),
      });
      queryClient.invalidateQueries({
        queryKey: ["userProfile"],
      });
      if (!deduct.ok) throw new Error("크레딧 부족");
      const res = await apiFetch("/api/conversations/interview", {
        method: "POST",
        body: JSON.stringify({
          companyName: data.company,
          jobTitle: data.position,
          jobPosting: data.jobPosting,
          interviewStyle: data.style.toUpperCase(),
          files: uploadedFiles,
        }),
      });

      if (!res.ok) throw new Error("인터뷰 생성 실패");

      const convo = await res.json();

      router.push(`/main/chatroom/${convo.conversationId}`);
    } catch (e) {
      console.error(e);
      alert("인터뷰 생성 실패 🤯");
      setShowLoading(false);
    }
  };

  if (showLoading) return <Loading />;

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
