import { useState } from "react";
import TextInput from "../../ui/form/TextInput";
import { Button } from "@/components/ui/button/button";
import { Textarea } from "@/components/ui/form";

import { TONE_OPTIONS } from "@/constants/tone";

interface RoleplayProps {
  onSubmit: (data: {
    myRole: string;
    aiRole: string;
    situation: string;
    tone: string;
  }) => void;
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
  const [details, setDetails] = useState("");
  const [selectedTone, setSelectedTone] = useState("casual");

  const [displayMe, setDisplayMe] = useState(
    mode === "topic" ? myRole || "" : "",
  );
  const [displayAI, setDisplayAI] = useState(
    mode === "topic" ? AiRole || "" : "",
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

  const handleHintMe = () => {
    setDisplayMe(myRole || "");
  };

  const handleHintAi = () => {
    setDisplayAI(AiRole || "");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <TextInput
        label="My role"
        value={displayMe}
        onChange={setDisplayMe}
        placeholder="Write your role"
        disabled={mode === "topic"}
        onClick={handleHintMe}
      />

      <TextInput
        label="AI's role"
        value={displayAI}
        onChange={setDisplayAI}
        placeholder="Write ai role"
        disabled={mode === "topic"}
        onClick={handleHintAi}
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
        value={details}
        onChange={setDetails}
        placeholder="Include details like the reason for the interaction..."
      />

      <div className="flex mt-auto pb-4">
        <Button variant="primary" size="lg" type="submit">
          Start
        </Button>
      </div>
    </form>
  );
}
