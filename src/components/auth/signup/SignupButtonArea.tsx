"use client";

import { Button } from "@/components/ui/button/button";

export default function SignupButtonArea({
  disabled,
  onClick,
  label = "Next",
}: {
  disabled?: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <div className="fixed bottom-24 w-full flex justify-center items-center">
      <Button variant="primary" size="lg" disabled={disabled} onClick={onClick}>
        {label}
      </Button>
    </div>
  );
}
