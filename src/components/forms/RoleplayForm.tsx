import { useState } from "react";
import FormInput from "../ui/form/FormInput";
import ActionButton from "../ui/button/ActionButton";
import Image from "next/image";
export default function RoleplayForm({
  onSubmit,
}: {
  onSubmit: (data: { isAI: string; me: string }) => void;
}) {
  const [isAI, setIsAI] = useState("");
  const [me, setMe] = useState("");
  const [detail, setDetail] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAI.trim() || !me.trim()) {
      alert("회사명과 직무를 입력해주세요.");
      return;
    }

    onSubmit({ isAI, me });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <FormInput
        label="AI`s role"
        required
        value={isAI}
        onChange={setIsAI}
        placeholder="Enter the AI"
      />

      <FormInput
        label="My role"
        required
        value={me}
        onChange={setMe}
        placeholder="Enter the you"
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
