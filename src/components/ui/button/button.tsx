import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-gray-800 text-white hover:bg-gray-900 rounded-full p-4",

        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",

        outline:
          "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",

        selected: "bg-blue-50 text-blue-600 border border-blue-600",

        ghost: "text-gray-600 hover:bg-gray-100",

        destructive: "bg-gray-900 text-white border-gray-900",
      },

      size: {
        lg: "w-[334px] h-13 text-base",
        md: "w-[236px] h-12 text-sm",
        sm: "px-3 py-1 text-sm",
        fluid: "flex-1 py-3 text-sm",
        icon: "w-9 h-9",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
