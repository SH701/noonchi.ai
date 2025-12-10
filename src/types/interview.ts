export type PresignedUrlResponse = {
  url: string;
};

export type ConversationResponse = {
  conversationId: number;
};

export type UploadedFile = {
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
};

export type InterviewFormData = {
  companyName: string;
  jobTitle: string;
  jobPosting: string;
  interviewStyle: string;
  files: File[];
};

export type InterviewApiRequest = {
  companyName: string;
  jobTitle: string;
  jobPosting: string;
  interviewStyle: string;
  files: UploadedFile[];
};

export const INTERVIEW_STYLES = [
  { value: "friendly", label: "Friendly" },
  { value: "standard", label: "Standard" },
  { value: "strict", label: "Strict" },
] as const;

export type InterviewStyle = (typeof INTERVIEW_STYLES)[number]["value"];
