"use client";

import { useState } from "react";

import { FileUpload, TextInput, Textarea } from "../../ui/form";
import { InterviewFormData } from "@/types/conversations";
import { Button } from "@/components/ui/button/button";

export interface InterviewFormProps {
  onSubmit: (data: InterviewFormData) => void;
}

export default function InterviewForm({ onSubmit }: InterviewFormProps) {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobPosting, setJobPosting] = useState("");

  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim() || !jobTitle.trim()) {
      return;
    }

    // onSubmit({
    //   companyName,
    //   jobTitle,
    //   jobPosting,
    //   files,
    // });
  };

  return (
    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
      <TextInput
        label="Company"
        required
        value={companyName}
        onChange={setCompanyName}
        placeholder="Enter the company name"
      />

      <TextInput
        label="Position Applied For"
        required
        value={jobTitle}
        onChange={setJobTitle}
        placeholder="Enter the job title"
      />

      <Textarea
        label="Job Posting"
        required
        value={jobPosting}
        onChange={setJobPosting}
        placeholder="You can paste the job description to generate more tailored interview questions."
        onClick={() => handleSubmit}
        disabled={false}
      />

      <FileUpload onFilesChange={setFiles} />

      <div className="mt-auto pb-4">
        <Button variant="primary" size="lg" type="submit">
          Start Chatting
        </Button>
      </div>
    </form>
  );
}
