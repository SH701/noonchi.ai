interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

export default function ActionButton({
  children,
  onClick,
  type = "button",
  disabled = false,
}: ActionButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={`
        w-[334px]
        h-[52px]
        px-[110px]
        py-[16px]
        rounded-lg
        flex
        items-center
        justify-center
        gap-[10px]
        font-medium
        transition-all
        ${
          disabled
            ? "bg-blue-600/50 dcursor-not-allowed text-white"
            : "bg-blue-600 text-white active:scale-[0.98] cursor-pointer"
        }
      `}
    >
      {children}
    </button>
  );
}
