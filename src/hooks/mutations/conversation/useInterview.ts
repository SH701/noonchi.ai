import { useMutation } from "@tanstack/react-query";
import { apiMutations } from "@/api/mutations";
import { InterviewFormData } from "@/types/conversations";

export const useUploadFiles = () => {
  return useMutation({
    mutationFn: apiMutations.files.uploadFiles,
  });
};

export const useCreateInterview = () => {
  return useMutation({
    mutationFn: async (data: InterviewFormData) => {
      return apiMutations.conversations.createInterview(data);
    },
  });
};
