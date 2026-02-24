import { TONE_OPTIONS } from "@/constants";

interface SelectButtonProps {
  selectedTone: string;
  onSelect: (value: string) => void;
}

export default function SelectButton({
  selectedTone,
  onSelect,
}: SelectButtonProps) {
  return (
    <div>
      <p className="text-sm font-semibold  text-gray-700 mb-2">
        Level of closeness
      </p>
      <div className="grid grid-cols-2 gap-3">
        {TONE_OPTIONS.map((tone) => (
          <button
            key={tone.value}
            type="button"
            onClick={() => onSelect(tone.value)}
            className={`
              py-3 px-4 rounded-lg transition-all text-left cursor-pointer
              ${selectedTone === tone.value ? "bg-white" : "bg-white/50"}
            `}
          >
            <div className="font-semibold text-sm">{tone.label}</div>
            <div className="text-xs text-gray-500">{tone.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
