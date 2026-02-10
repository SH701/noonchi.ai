import { LoaderIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SpinnerProps extends React.ComponentProps<"svg"> {
  size?: string;
  color?: string;
}

function Spinner({ size, color, className, style, ...props }: SpinnerProps) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-6 animate-spin", className)}
      style={{ width: size, height: size, color, ...style }}
      {...props}
    />
  );
}

export { Spinner };
