"use client";

import { ReactNode } from "react";

interface HeaderProps {
  leftIcon?: ReactNode;
  center: string | ReactNode;
  rightIcon?: ReactNode;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  className?: string;
}

export default function Header({
  leftIcon,
  center,
  rightIcon,
  onLeftClick,
  onRightClick,
  className,
}: HeaderProps) {
  return (
    <div className="w-full py-8 flex justify-between items-center backdrop-blur-md">
      <div className="w-6 cursor-pointer" onClick={onLeftClick}>
        {leftIcon}
      </div>
      <span className="text-xl font-semibold">{center}</span>
      <div
        className={`w-6 cursor-pointer ${className ?? ""}`}
        onClick={onRightClick}
      >
        {rightIcon}
      </div>
    </div>
  );
}
