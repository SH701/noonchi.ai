import * as React from "react";
import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  disabled,
  placeholder,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      placeholder={disabled ? undefined : placeholder}
      disabled={disabled}
      className={cn(
        "w-full px-4 py-3 ",
        "bg-gray-50 border border-gray-200 ",
        " rounded-xl text-gray-900 placeholder-gray-400",
        "focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
        "transition-colors",
        "aria-invalid:ring-red aria-invalid:border-red",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
