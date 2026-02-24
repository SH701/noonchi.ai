"use client";

import { Textarea, TextInput } from "@/components/ui/form";
import SelectButton from "@/components/ui/form/SelectButton";
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
  const [selectedTone,setSelectedTone] = useState("")
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
  const [isPending,setIsPending] = useState(false) // 주제? 설정하면 바꿔야함
  // Todo: 사진 업로드 후 채팅방 생성
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        label="My Role"
        value={isMe}
        onChange={setIsMe}
        placeholder="ex) A team member"
      />
      <TextInput
        label="AI Role"
        value={isAI}
        onChange={setIsAI}
        placeholder="ex) A colleague"
      />
      <SelectButton selectedTone={selectedTone} onSelect={setSelectedTone} />
      <Textarea
        label="Detail"
        value={details}
        required
        onChange={setDeatils}
        disabled={isPending}
        onClick={()=>{}}
        placeholder="Please provide a detailed description"
      />
    </form>
  );
}
