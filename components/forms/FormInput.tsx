import React from "react";

interface Props {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function FormInput({
  label,
  required,
  value,
  onChange,
  placeholder,
}: Props) {
  return (
    <div>
      <label className="text-sm font-semibold text-black mb-2 flex gap-2">
        {label} {required && <p className="text-red-500">*</p>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2.5 rounded-lg border border-gray-200 bg-white text-black placeholder-gray-400 placeholder:text-sm"
        placeholder={placeholder}
      />
    </div>
  );
}
