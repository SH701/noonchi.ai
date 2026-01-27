"use client";

import { ModalProps } from "@/types/etc";
import Image from "next/image";

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  image,
  className = "",
}: ModalProps & {
  image?: { src: string; alt: string; width: number; height: number };
}) {
  if (!isOpen) return null;

  const defaultClassName =
    "w-[320px] bg-white rounded-xl flex flex-col justify-center items-center px-4 py-12 gap-2";

  const finalClassName = className || defaultClassName;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-9999 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div onClick={(e) => e.stopPropagation()} className={finalClassName}>
          {image && (
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
            />
          )}

          {title && (
            <h3 className="text-xl font-semibold text-gray-900 text-center whitespace-pre-line ">
              {title}
            </h3>
          )}

          {description && (
            <p className="text-sm text-gray-700 text-center pb-8 whitespace-pre-line">
              {description}
            </p>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
