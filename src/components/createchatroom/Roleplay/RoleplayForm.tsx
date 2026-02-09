import { useState } from "react";
import TextInput from "../../ui/form/TextInput";
import { Button } from "@/components/ui/button/button";
import { Textarea } from "@/components/ui/form";

import { TONE_OPTIONS } from "@/constants/tone";
import { useCreateContext } from "@/hooks/mutations/language/useCreateContext";

interface RoleplayProps {
  onSubmit: (data: {
    myRole: string | undefined;
    aiRole: string | undefined;
    situation: string | undefined;
    tone: string;
  }) => void;
  AiRole?: string;
  myRole?: string;
  mode: "topic" | "custom";
  topicId: number;
}

export default function RoleplayForm({
  onSubmit,
  AiRole,
  myRole,
  mode,
  topicId,
}: RoleplayProps) {
  const [details, setDetails] = useState<string | undefined>(undefined);
  const [selectedTone, setSelectedTone] = useState("casual");
  const { mutate: createContext, isPending } = useCreateContext(topicId);
  const [displayMe, setDisplayMe] = useState<string | undefined>(
    myRole || undefined,
  );
  const [displayAI, setDisplayAI] = useState<string | undefined>(
    AiRole || undefined,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      myRole: displayMe,
      aiRole: displayAI,
      situation: details,
      tone: selectedTone,
    });
  };

  const handleMeHint = () => {
    createContext(undefined, {
      onSuccess: (data) => setDisplayMe(data.myRole),
    });
  };
  const handleAIHint = () => {
    createContext(undefined, {
      onSuccess: (data) => setDisplayAI(data.aiRole),
    });
  };
  const handleDetailHint = () => {
    createContext(undefined, {
      onSuccess: (data) => setDetails(data.detail),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <TextInput
        label="My role"
        required
        value={displayMe || ""}
        onChange={setDisplayMe}
        placeholder="Write your role"
        disabled={isPending}
        onClick={handleMeHint}
      />

      <TextInput
        label="AI's role"
        required
        value={displayAI || ""}
        onChange={setDisplayAI}
        placeholder="Write ai role"
        disabled={isPending}
        onClick={handleAIHint}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Level of closeness</label>
        <div className="grid grid-cols-2 gap-2">
          {TONE_OPTIONS.map((tone) => (
            <button
              key={tone.value}
              type="button"
              onClick={() => setSelectedTone(tone.value)}
              className={`
                py-3 px-4 rounded-lg  transition-all text-left cursor-pointer
                ${selectedTone === tone.value ? " bg-white" : " bg-white/50"}
              `}
            >
              <div className="font-semibold text-sm">{tone.label}</div>
              <div className="text-xs text-gray-500">{tone.description}</div>
            </button>
          ))}
        </div>
      </div>

      <Textarea
        label="Detail"
        value={details || ""}
        required
        onChange={setDetails}
        placeholder="Include details like the reason for the interaction..."
        onClick={handleDetailHint}
        disabled={isPending}
      />

      <div className="flex mt-auto pb-4">
        <Button variant="primary" size="lg" type="submit">
          Start
        </Button>
      </div>
    </form>
  );
}
