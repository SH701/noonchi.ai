"use client";

import { ModalProps } from "@/types/modal";

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-[320px]
          bg-white
          rounded-[12px]
          flex flex-col
          justify-center
          items-center
          px-[16px]
          py-[48px]
          gap-[28px]
        "
      >
        {title && (
          <h3 className="text-xl font-semibold text-gray-900 text-center">
            {title}
          </h3>
        )}

        {description && (
          <p className="text-sm text-gray-700 text-center whitespace-pre-line">
            {description}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}
