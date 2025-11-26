interface Props {
  options: readonly { value: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
}

export default function OptionButtons({ options, selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-6">
      {options.map((option) => {
        const isStandard = option.label.toLowerCase() === "standard";
        const isSelected = selected.toLowerCase() === "standard" && isStandard;

        return (
          <button
            key={option.value}
            type="button"
            disabled={!isStandard}
            onClick={() => isStandard && onSelect("standard")}
            className={`
              px-3 py-2 h-11 min-w-[90px] rounded-lg text-sm font-medium transition-colors border
              ${
                isSelected
                  ? "bg-blue-50 text-[#3B6BF0] border-blue-600"
                  : "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed"
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
