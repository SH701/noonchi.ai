"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import UserCharge from "@/components/modal/UserCharge";
import { useUser } from "@/hooks/queries";
import GuestCharge from "@/components/modal/GuestCharge";

import {
  useUploadFiles,
  useCreateInterview,
  useDeductCredit,
} from "@/hooks/mutations";
import { INTERVIEW_STYLES, InterviewFormData } from "@/types/conversations";
import { ChatroomLoading } from "@/components/ui/loading";
import { InterviewForm, InterviewHeader } from "@/components/createchatroom";

export default function Interview() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [needCharge, setNeedCharge] = useState(false);

  const { data: user } = useUser();

  const uploadFiles = useUploadFiles();
  const deductCredit = useDeductCredit();
  const createInterview = useCreateInterview();

  const isLoading =
    uploadFiles.isPending ||
    deductCredit.isPending ||
    createInterview.isPending;

  const handleSubmit = async (data: InterviewFormData) => {
    try {
      const uploadedFiles = await uploadFiles.mutateAsync(data.files);

      try {
        await deductCredit.mutateAsync(60);
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      } catch (error) {
        console.error("크레딧 차감 실패:", error);
        setNeedCharge(true);
        return;
      }

      const convo = await createInterview.mutateAsync({
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        jobPosting: data.jobPosting,
        interviewStyle: data.interviewStyle.toUpperCase(),
        files: uploadedFiles,
      });

      router.push(`/main/chatroom/${convo.conversationId}`);
    } catch (e) {
      console.error("인터뷰 생성 실패:", e);
      alert("인터뷰 생성 실패 🤯");
    }
  };

  if (isLoading) return <ChatroomLoading />;

  return (
    <div className="flex flex-col pt-14 relative bg-white w-full overflow-x-hidden">
      <InterviewHeader />
      <div className="w-full flex justify-center">
        <div className="w-full max-w-93.75 px-5">
          <InterviewForm
            interviewStyles={INTERVIEW_STYLES}
            onSubmit={handleSubmit}
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
