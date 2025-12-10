"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import Loading from "../../chatroom/[id]/loading";

import { apiFetch } from "@/lib/api/api";
import InterviewForm from "@/components/ui/forms/InterviewForm";
import { useQueryClient } from "@tanstack/react-query";
import UserCharge from "@/components/modal/UserCharge";
import { useUserProfile } from "@/hooks/user/useUserProfile";
import GuestCharge from "@/components/modal/GuestCharge";
import {
  INTERVIEW_STYLES,
  InterviewFormData,
  InterviewApiRequest,
  PresignedUrlResponse,
  ConversationResponse,
  UploadedFile,
} from "@/types/interview";

export default function Interview() {
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);
  const queryClient = useQueryClient();
  const [needCharge, setNeedCharge] = useState(false);
  const { data: user } = useUserProfile();

  const handleSubmit = async (data: InterviewFormData) => {
    setShowLoading(true);
    try {
      const uploadedFiles: UploadedFile[] = await Promise.all(
        data.files.map(async (file: File) => {
          const presignedData = await apiFetch<PresignedUrlResponse>(
            "/api/files/presigned-url",
            {
              method: "POST",
              body: JSON.stringify({
                fileExtension: file.name.split(".").pop(),
                fileType: file.type,
              }),
            }
          );

          await fetch(presignedData.url, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });

          return {
            fileUrl: presignedData.url.split("?")[0],
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
          };
        })
      );

      try {
        await apiFetch<void>("/api/users/credit/deduct", {
          method: "POST",
          body: JSON.stringify({ amount: 60 }),
        });

        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      } catch (error) {
        console.error("크레딧 차감 실패:", error);
        setShowLoading(false);
        setNeedCharge(true);
        return;
      }

      const convo = await apiFetch<ConversationResponse>(
        "/api/conversations/interview",
        {
          method: "POST",
          body: JSON.stringify({
            companyName: data.companyName,
            jobTitle: data.jobTitle,
            jobPosting: data.jobPosting,
            interviewStyle: data.interviewStyle.toUpperCase(),
            files: uploadedFiles,
          } as InterviewApiRequest),
        }
      );

      router.push(`/main/chatroom/${convo.conversationId}`);
    } catch (e) {
      console.error("인터뷰 생성 실패:", e);
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
      {needCharge && user?.role === "ROLE_USER" ? (
        <UserCharge isOpen={needCharge} onClose={() => setNeedCharge(false)} />
      ) : (
        <GuestCharge isOpen={needCharge} onClose={() => setNeedCharge(false)} />
      )}
    </div>
  );
}
