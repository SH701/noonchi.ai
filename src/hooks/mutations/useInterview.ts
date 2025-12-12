import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/api";
import { InterviewApiRequest, PresignedUrlResponse, UploadedFile } from "@/types/conversations/interview/interview.type";
import { ConversationResponse } from "@/types/conversations/conversations.type";


export const useUploadFiles = () => {
  return useMutation({
    mutationFn: async (files: File[]): Promise<UploadedFile[]> => {
      return Promise.all(
        files.map(async (file) => {
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
    },
  });
};

export const useDeductCredit = () => {
  return useMutation({
    mutationFn: async (amount: number) => {
      return apiFetch<void>("/api/users/credit/deduct", {
        method: "POST",
        body: JSON.stringify({ amount }),
      });
    },
  });
};

export const useCreateInterview = () => {
  return useMutation({
    mutationFn: async (data: InterviewApiRequest) => {
      return apiFetch<ConversationResponse>("/api/conversations/interview", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  });
};
