"use client";

interface TopicButtonProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function TopicButton({
  label,
  active,
  onClick,
}: TopicButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap border
        transition-colors duration-200 cursor-pointer
        ${
          active
            ? "bg-gray-900 text-white border-gray-900"
            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
        }
      `}
    >
      {label}
    </button>
  );
}
