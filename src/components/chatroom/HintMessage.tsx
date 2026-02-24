import { Lightbulb } from "lucide-react";

interface HintProps {
  hintData: string[];
  onSelect: (hint: string) => void;
}

export default function HintMessage({ hintData, onSelect }: HintProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 bg-white border px-3 pt-3 pb-7 shadow-sm rounded-t-[20px] border-white -mb-6">
      <div className="flex gap-2 text-sm text-gray-400 font-medium">
        <Lightbulb className="size-4" />
        <span>Please choose the correct one</span>
      </div>
      {hintData.map((h, idx) => (
        <div
          key={idx}
          className="rounded-xl px-3.5 py-3 border border-gray-300 bg-white/50 w-full"
        >
          <p className="text-sm text-gray-700 cursor-pointer" onClick={() => onSelect(h)}>
            {h}
          </p>
        </div>
      ))}
    </div>
  );
}
