"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import Loading from "../../chatroom/[id]/loading";

import InterviewForm from "@/components/ui/forms/InterviewForm";
import { useQueryClient } from "@tanstack/react-query";
import UserCharge from "@/components/modal/UserCharge";
import { useUser } from "@/hooks/queries/useUser";
import GuestCharge from "@/components/modal/GuestCharge";

import {
  useUploadFiles,
  useCreateInterview,
} from "@/hooks/mutations/useInterview";
import {
  INTERVIEW_STYLES,
  InterviewFormData,
} from "@/types/conversations/interview/interview.type";
import { useDeductCredit } from "@/hooks/mutations/useCredit";

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

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col pt-14 relative bg-white w-full overflow-x-hidden">
      <div className="flex items-center w-full px-4">
        <button
          onClick={() => router.push("/main")}
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
