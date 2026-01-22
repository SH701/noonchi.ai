import { useState } from "react";
import FormInput from "../../ui/form/FormInput";
import { Button } from "../../ui/button";

interface RoleplayProps {
  onSubmit: (data: { details: string; tone: string }) => void;
  AiRole?: string;
  myRole?: string;
  mode: "topic" | "custom";
}

const TONE_OPTIONS = [
  { value: "casual", label: "Casual", description: "(Friends, Siblings)" },
  { value: "friendly", label: "Friendly", description: "(Close colleagues)" },
  {
    value: "professional",
    label: "Professional",
    description: "(Clients, Professors)",
  },
  {
    value: "formal",
    label: "Formal",
    description: "(High-level executives, Public)",
  },
];

export default function RoleplayForm({
  onSubmit,
  AiRole,
  myRole,
  mode,
}: RoleplayProps) {
  const [isAI, setIsAI] = useState(AiRole || "");
  const [me, setMe] = useState(myRole || "");
  const [details, setDetails] = useState("");
  const [selectedTone, setSelectedTone] = useState("casual");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!details.trim()) {
      alert("Please fill in the details.");
      return;
    }

    onSubmit({ details, tone: selectedTone });
  };

  const inputStyle =
    mode === "topic" ? "bg-indigo-50 border-blue-600 text-blue-600" : "";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <FormInput
        label="My role"
        value={me}
        onChange={setMe}
        className={inputStyle}
        disabled={mode === "topic"}
      />
      <FormInput
        label="AI's role"
        value={isAI}
        onChange={setIsAI}
        className={inputStyle}
        disabled={mode === "topic"}
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
                py-3 px-4 rounded-lg border transition-all text-left
                ${
                  selectedTone === tone.value
                    ? "border-blue-500 bg-blue-50 "
                    : ""
                }
              `}
            >
              <div className="font-semibold text-sm">{tone.label}</div>
              <div className="text-xs text-gray-500">{tone.description}</div>
            </button>
          ))}
        </div>
      </div>

      <textarea
        required
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Include details like the reason for the interaction..."
        className="w-full py-4 px-4 h-30 rounded-lg border"
      />

      <div className="flex mt-auto pb-4">
        <Button variant="primary" size="lg" type="submit">
          Start Chatting
        </Button>
      </div>
    </form>
  );
}
