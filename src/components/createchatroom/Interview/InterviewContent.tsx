export default function IntreviewContent() {
  return null;
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// import { useQueryClient } from "@tanstack/react-query";

// import {
//   useUploadFiles,
//   useCreateInterview,
//   useDeductCredit,
// } from "@/hooks/mutations";
// import { InterviewFormData } from "@/types/conversations";

// import { InterviewForm } from "@/features/createchatroom";
// import InterviewSection from "@/features/createchatroom/Interview/InterviewSection";

// export default function InterviewContent() {
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   const [, setNeedCharge] = useState(false);

//   const uploadFiles = useUploadFiles();
//   const deductCredit = useDeductCredit();
//   const createInterview = useCreateInterview();

//   const isLoading =
//     uploadFiles.isPending ||
//     deductCredit.isPending ||
//     createInterview.isPending;

//   const handleSubmit = async (data: InterviewFormData) => {
//     try {
//       const uploadedFiles = await uploadFiles.mutateAsync(data.files);

//       try {
//         await deductCredit.mutateAsync(1);
//         queryClient.invalidateQueries({ queryKey: ["userProfile"] });
//       } catch (error) {
//         console.error("크레딧 차감 실패:", error);
//         setNeedCharge(true);
//         return;
//       }

//       const convo = await createInterview.mutateAsync({
//         companyName: data.companyName,
//         jobTitle: data.jobTitle,
//         jobPosting: data.jobPosting,
//         interviewStyle: "friendly",
//         files: uploadedFiles,
//       });
//       router.push(`/main/roleplay/chatroom/${convo.conversationId}`);
//     } catch (e) {
//       console.error("인터뷰 생성 실패:", e);
//       alert("인터뷰 생성 실패 🤯");
//     }
//   };

//   if (isLoading) return <div>Loading...</div>;

//   return (
//     <div className="flex flex-col  relative  w-full overflow-x-hidden">
//       <div className="w-full flex justify-center items-center">
//         <div className="w-full max-w-93.75">
//           <InterviewSection topic={CareerTopics[0]} />
//           <p className="font-semibold pb-5 pt-8">Conversation Context</p>
//           <InterviewForm onSubmit={handleSubmit} />
//         </div>
//       </div>
//     </div>
//   );
// }
