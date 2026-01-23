"use client";

import { LoginContent } from "@/components/auth";
import { useModalActions } from "@/store/modal/useModalStore";

export default function Preview() {
  const { openModal } = useModalActions();

  const handleLogin = () => {
    openModal(<LoginContent />);
  };

  return (
    <div className="min-h-screen">
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}
