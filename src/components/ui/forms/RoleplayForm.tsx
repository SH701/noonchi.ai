import { useState } from "react";

import Image from "next/image";
import FormInput from "../form/FormInput";
import { Button } from "../button";

interface RoleplayProps {
  onSubmit: (data: { details: string }) => void;
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
  const [details, setDetails] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!details.trim()) {
      alert("Please fill in the details.");
      return;
    }

    onSubmit({ details });
  };

  const inputStyle =
    mode === "topic" ? "bg-indigo-50 border-blue-600 text-blue-600" : "";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <FormInput
        label="AI`s role"
        value={isAI}
        onChange={setIsAI}
        className={inputStyle}
        disabled={mode === "topic"}
      />

      <FormInput
        label="My role"
        value={me}
        onChange={setMe}
        className={inputStyle}
        disabled={mode === "topic"}
      />

      <textarea
        required
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Include details like the reason for the interaction..."
        className="w-83.75 py-4.5 px-4 h-30 rounded-lg border"
      />

      <div className="flex items-center flex-col fixed bottom-8">
        <div className="flex gap-2.5 px-4 py-2.5 bg-blue-100 rounded-lg">
          <Image
            src="/credits/interviewcredit.png"
            alt="크레딧 소모"
            width={16}
            height={16}
          />
          <p className="text-blue-600 text-xs">
            It costs 20 credits to run this chat
          </p>
        </div>

        <div className="mt-2">
          <Button variant="primary" size="lg" type="submit">
            Start Chatting
          </Button>
        </div>
      </div>
    </form>
  );
}
