interface Props {
  options: readonly { value: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
}

export default function OptionButtons({ options, selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={`px-3 py-2 h-11 min-w-[90px] rounded-lg text-sm font-medium transition-colors
    ${
      selected === option.value
        ? "bg-blue-50 text-[#3B6BF0] border-blue-600 border"
        : "text-gray-400 hover:bg-gray-200 border border-gray-200"
    }
  `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
