import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-gray-800 text-white hover:bg-gray-900  p-4",
        secondary: " border bg-white text-gray-900 hover:bg-white/90",
        ghost: "bg-white/50  rounded-xl text-black/50 active:bg-blue-50/50 ",
        outline:
          "border border-white rounded-lg bg-white/50 text-black justify-start px-3 text-left text-sm flex-wrap",
      },

      size: {
        lg: "w-[334px] h-13 text-base",
        md: "w-[236px] h-12 text-sm",
        sm: "px-3 py-1 text-sm",
        fluid: "flex-1 py-3 text-sm",
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
