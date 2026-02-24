export interface PresignedUrlRes {
  url: string;
}
export interface UploadedFile {
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}
export interface InterviewFormData {
  companyName: string;
  jobTitle: string;
  jobPosting: string;
  interviewStyle:string
  files: File[];
}






