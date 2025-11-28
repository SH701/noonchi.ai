"use client";

import { useState } from "react";
import FormInput from "../ui/form/FormInput";
import OptionButtons from "../ui/button/OptionsButton";
import FileUpload from "../ui/form/FileUpload";
import ActionButton from "../ui/button/ActionButton";

export interface InterviewFormProps {
  interviewStyles: readonly { value: string; label: string }[];
  onSubmit: (data: {
    company: string;
    position: string;
    jobPosting: string;
    style: string;
    files: File[];
  }) => void;
}

export default function InterviewForm({
  interviewStyles,
  onSubmit,
}: InterviewFormProps) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [jobPosting, setJobPosting] = useState("");
  const [style, setStyle] = useState("standard");
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!company.trim() || !position.trim()) {
      alert("회사명과 지원 직무를 입력해주세요.");
      return;
    }

    onSubmit({
      company,
      position,
      jobPosting,
      style,
      files,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <FormInput
        label="Company"
        required
        value={company}
        onChange={setCompany}
        placeholder="Enter the company name"
      />

      <FormInput
        label="Position Applied For"
        required
        value={position}
        onChange={setPosition}
        placeholder="Enter the job title"
      />

      <FormInput
        label="Job Posting"
        value={jobPosting}
        onChange={setJobPosting}
        placeholder="Paste the job posting from the company (optional)"
      />

      <FileUpload onFilesChange={setFiles} />

      <div>
        <label className="text-sm font-semibold text-black mb-2 flex gap-2">
          Interview Style
        </label>
        <OptionButtons
          options={interviewStyles}
          selected={style}
          onSelect={setStyle}
        />
      </div>

      <div className=" fixed bottom-8 flex items-center justify-center">
        <ActionButton type="submit">Start Chatting</ActionButton>
      </div>
    </form>
  );
}
