export type InterviewRequest = {
  companyName: string;
  jobTitle: string;
  jobPosting: string;
  interviewStyle: "STANDARD" | "BEHAVIORAL" | "CUSTOM"; // 서버 ENUM에 맞게 수정해야 함
  files: {
    fileUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  }[];
};
