"use client";

import { toast as sonnerToast, Toaster as SonnerToaster } from "sonner";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Ban, Check } from "lucide-react";

type ToastType = "success" | "error";

const ICON_MAP: Record<ToastType, ReactNode> = {
  success: <Check className="size-8" />,
  error: <Ban className="size-8" />,
};
const STYLE_MAP: Record<ToastType, string> = {
  success: "bg-emerald-500",
  error: "bg-red-500",
};
const renderToast = (message: string, type: ToastType, duration = 2000) => {
  sonnerToast.custom(
    (id) => (
      <div
        onClick={() => sonnerToast.dismiss(id)}
        className={cn(
          "flex items-center gap-2 rounded-xl bg-black/60 px-4 py-3 text-sm font-semibold text-white",
          STYLE_MAP[type],
        )}
      >
        {ICON_MAP[type]}
        <span className="truncate">{message}</span>
      </div>
    ),
    { duration },
  );
};

export const toast = {
  success: (message: string, duration?: number) =>
    renderToast(message, "success", duration),

  error: (message: string, duration?: number) =>
    renderToast(message, "error", duration),
};

export const Toaster = () => {
  return (
    <SonnerToaster
      position="bottom-center"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "w-full flex justify-center",
        },
      }}
      offset={40}
      gap={8}
      visibleToasts={5}
    />
  );
};
