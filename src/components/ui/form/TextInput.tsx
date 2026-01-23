"use client";

interface TextInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className?: string;
}

export default function TextInput({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  required,
  className = "",
}: TextInputProps) {
  return (
    <div className="flex flex-col space-y-2 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full p-2.5
           border border-gray-400 
          rounded-xl text-gray-900 placeholder-gray-400
          focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
          transition-colors
          ${className}
        `}
      />
    </div>
  );
}
