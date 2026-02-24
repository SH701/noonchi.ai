import { useState } from "react";
import TextInput from "../../ui/form/TextInput";
import { Button } from "@/components/ui/button/button";
import { Textarea } from "@/components/ui/form";

import { useCreateContext } from "@/hooks/mutations/language/useCreateContext";
import SelectButton from "@/components/ui/form/SelectButton";

interface RoleplayProps {
  onSubmit: (data: {
    myRole: string | undefined;
    aiRole: string | undefined;
    situation: string | undefined;
    tone: string;
  }) => void;
  AiRole?: string;
  myRole?: string;
  topicId: number;
}

export default function RoleplayForm({
  onSubmit,
  AiRole,
  myRole,
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

      <SelectButton selectedTone={selectedTone} onSelect={setSelectedTone} />

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
