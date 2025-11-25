interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  label,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="
    w-[236px] h-[48px]
    bg-blue-600 hover:bg-blue-700
    text-blue-50 font-semibold
    rounded-lg leading-5 transition-all
    flex items-center justify-center
    cursor-pointer
  "
    >
      {label}
    </button>
  );
}
