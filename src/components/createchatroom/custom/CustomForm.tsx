"use client";

import { TextInput } from "@/components/ui/form";
import { toast } from "@/components/ui/toast/toast";
import { useState } from "react";

interface CustomProps {
  onSubmit: (data: {
    myRole: string;
    aiRole: string;
    details: string;
    tone?: string;
  }) => void;
  AiRole?: string;
  myRole?: string;
}

export default function CustomForm({ onSubmit }: CustomProps) {
  const [isMe, setIsMe] = useState("");
  const [isAI, setIsAI] = useState("");
  const [details, setDeatils] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      toast.error("Please fill in the details.");
      return;
    }
    onSubmit({
      myRole: isMe,
      aiRole: isAI,
      details,
    });
  };
  // Todo: 사진 업로드 후 채팅방 생성
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <TextInput
        label="My Role"
        value={""}
        onChange={() => setIsMe(isMe)}
        placeholder="ex) A team member"
      />
      <TextInput
        label="AI Role"
        value={""}
        onChange={() => setIsAI(isAI)}
        placeholder="ex) A colleague"
      />
      <TextInput
        label="Detail"
        value={details}
        onChange={() => setDeatils(details)}
        placeholder="Please provide a detailed description"
      />
    </form>
  );
}
