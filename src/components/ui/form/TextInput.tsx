"use client";

import { Wand } from "lucide-react";
import { usePathname } from "next/navigation";
import { Spinner } from "../spinner/spinner";

interface TextInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onClick?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
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
  disabled,
  onClick,
}: TextInputProps) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col space-y-2 w-full relative">
      {label && (
        <label className="text-sm font-semibold text-gray-700 flex gap-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full py-2.5 pl-2.5 pr-10
           border border-gray-400 bg-white text-sm
          rounded-xl text-gray-900 placeholder-gray-400 placeholder:text-sm
          focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-inset focus:ring-blue-500
          transition-colors
          ${className}
        `}
      />
      {pathname.startsWith("/main/roleplay/create") &&
        (disabled ? (
          <Spinner className=" absolute right-3 top-10" />
        ) : (
          <button
            className="absolute right-3 top-10"
            onClick={onClick}
            type="button"
          >
            <Wand />
          </button>
        ))}
    </div>
  );
}
