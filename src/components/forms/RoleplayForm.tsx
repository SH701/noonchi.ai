import { useState } from "react";
import FormInput from "../ui/form/FormInput";
import ActionButton from "../ui/button/ActionButton";

export default function RoleplayForm({
  onSubmit,
}: {
  onSubmit: (data: { isAI: string; me: string }) => void;
}) {
  const [isAI, setIsAI] = useState("");
  const [me, setMe] = useState("");

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
        label="AI"
        required
        value={isAI}
        onChange={setIsAI}
        placeholder="Enter the AI"
      />

      <FormInput
        label="Position"
        required
        value={me}
        onChange={setMe}
        placeholder="Enter the you"
      />
      <FormInput
        label="Situation"
        required
        value={isAI}
        onChange={setIsAI}
        placeholder="Enter the situation"
      />
      <div className=" fixed bottom-8 flex items-center justify-center">
        <ActionButton type="submit">Start Chatting</ActionButton>
      </div>
    </form>
  );
}
