import { Spinner } from "../spinner/spinner";
import { WandIcon } from "@/assets/svgr";
interface TextareaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  onClick: () => void;
  disabled: boolean;
}

export default function Textarea({
  label,
  value,
  onChange,
  placeholder,
  required,
  className,
  onClick,
  disabled,
}: TextareaProps) {
  return (
    <div className="flex flex-col space-y-2 w-full relative">
      {label && (
        <label className="text-sm font-semibold text-gray-700 flex gap-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        required={required}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full py-2.5 pl-2.5 pr-10  h-30
           border border-gray-400 bg-white
          rounded-xl text-gray-800 placeholder-gray-400
          focus:outline-none focus:border-blue-500 focus:ring-1  focus:ring-inset focus:ring-blue-500
          transition-colors
          ${className}
        `}
      />
      {disabled ? (
        <Spinner className=" absolute right-3 top-10" />
      ) : (
        <button
          className="absolute right-3 top-10"
          onClick={onClick}
          type="button"
        >
          <WandIcon />
        </button>
      )}
    </div>
  );
}
