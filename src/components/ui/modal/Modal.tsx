"use client";

import { ModalProps } from "@/types/etc";

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className = "",
}: ModalProps) {
  if (!isOpen) return null;

  const defaultClassName =
    "w-[320px] bg-white rounded-xl flex flex-col justify-center items-center px-4 py-12 gap-7";

  const finalClassName = className || defaultClassName;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-9999 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div onClick={(e) => e.stopPropagation()} className={finalClassName}>
          {title && (
            <h3 className="text-xl font-semibold text-gray-900 text-center whitespace-pre-line">
              {title}
            </h3>
          )}

          {description && (
            <p className="text-sm text-gray-700 text-center whitespace-pre-line leading-5">
              {description}
            </p>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
