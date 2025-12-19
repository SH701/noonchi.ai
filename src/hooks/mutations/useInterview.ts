import { useMutation } from "@tanstack/react-query";
import { apiMutations } from "@/lib/api/mutations";
import { InterviewApiRequest } from "@/types/conversations/interview/interview.type";

export const useUploadFiles = () => {
  return useMutation({
    mutationFn: apiMutations.files.uploadFiles,
  });
};

export const useCreateInterview = () => {
  return useMutation({
    mutationFn: async (data: InterviewApiRequest) => {
      return apiMutations.conversations.createInterview(data);
    },
  });
};
