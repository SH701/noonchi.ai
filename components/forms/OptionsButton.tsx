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
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selected === option.value
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
