interface TextareaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  onClick: () => void;
}

export default function Textarea({
  label,
  value,
  onChange,
  placeholder,
  required,
  className,
  onClick,
}: TextareaProps) {
  return (
    <div className="flex flex-col space-y-2 w-full">
      {label && (
        <label className="text-sm font-semibold text-gray-700 flex gap-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onClick={onClick}
        className={`
          w-full p-2.5 h-30
           border border-gray-400 bg-white
          rounded-xl text-gray-900 placeholder-gray-400
          focus:outline-none focus:border-blue-500 focus:ring-1  focus:ring-inset focus:ring-blue-500
          transition-colors
          ${className}
        `}
      />
    </div>
  );
}
