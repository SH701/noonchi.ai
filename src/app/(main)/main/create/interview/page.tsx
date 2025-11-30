"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

import Loading from "../../chatroom/[id]/loading";
import InterviewForm from "@/components/forms/InterviewForm";
import { useAuthStore } from "@/store/auth";

const INTERVIEW_STYLES = [
  { value: "friendly", label: "Friendly" },
  { value: "standard", label: "Standard" },
  { value: "strict", label: "Strict" },
] as const;
export type UploadedFiles = File[];
export default function Interview() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);
  const handleSubmit = async (data: any) => {
    setShowLoading(true);
    try {
      const uploadedFiles = [];
      for (const file of data.files) {
        const presignRes = await fetch("/api/files/presigned-url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
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
        console.log(url);
        const fileUrl = url.split("?")[0];

        uploadedFiles.push({
          fileUrl,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        });
      }

      const res = await fetch("/api/conversations/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
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
      alert("생성 실패");
    } finally {
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
