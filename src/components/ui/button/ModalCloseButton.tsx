interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled: boolean;
}

export default function FeedbackCloseButton({
  label,
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="
    w-[236px] h-12
    bg-gray-200 hover:bg-gray-300
     font-semibold
    rounded-lg leading-5 transition-all
    flex items-center justify-center
    cursor-pointer
  "
    >
      {label}
    </button>
  );
}
