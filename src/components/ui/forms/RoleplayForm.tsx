import { useState } from "react";

import Image from "next/image";
import FormInput from "../form/FormInput";
import { ActionButton } from "../button";
import { useQueryClient } from "@tanstack/react-query";

interface RoleplayProps {
  onSubmit: (data: { isAI: string; me: string; detail: string }) => void;
  AiRole?: string;
  myRole?: string;
  mode: "topic" | "custom";
}

export default function RoleplayForm({
  onSubmit,
  AiRole,
  myRole,
  mode,
}: RoleplayProps) {
  const [isAI, setIsAI] = useState(AiRole || "");
  const [me, setMe] = useState(myRole || "");
  const [detail, setDetail] = useState("");
  const queryClient = useQueryClient();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAI?.trim() || !me?.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    queryClient.invalidateQueries({
      queryKey: ["userProfile"],
    });
    onSubmit({ isAI, me, detail });
  };
  const inputStyle =
    mode === "topic" ? "bg-indigo-50 border-blue-600 text-blue-600 " : "";
  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <FormInput
        label="AI`s role"
        required
        value={isAI}
        onChange={setIsAI}
        placeholder="Enter the AI"
        className={inputStyle}
        disabled={mode === "topic"}
      />

      <FormInput
        label="My role"
        required
        value={me}
        onChange={setMe}
        placeholder="Enter the you"
        className={inputStyle}
        disabled={mode === "topic"}
      />
      <FormInput
        label="Detail"
        required
        value={detail}
        onChange={setDetail}
        placeholder="Please the job posting from the company"
      />
      <div className="flex items-center flex-col fixed bottom-8">
        <div className="flex gap-2.5  px-4 py-2.5 bg-blue-100 mt-20  rounded-lg">
          <Image
            src="/credits/interviewcredit.png"
            alt="크레딧 소모"
            width={16}
            height={16}
          />
          <p className="text-blue-600 text-xs">
            It costs 60 credits to run this chat
          </p>
        </div>
        <div className="mt-2">
          <ActionButton type="submit">Start Chatting</ActionButton>
        </div>
      </div>
    </form>
  );
}
