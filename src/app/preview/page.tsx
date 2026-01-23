"use client";

import { PreviewEnd } from "@/components/auth";
import { useModalActions } from "@/store/modal/useModalStore";

export default function Preview() {
  const { openModal } = useModalActions();

  const handle = () => {
    openModal(<PreviewEnd />);
  };

  return (
    <div className="min-h-screen">
      <button onClick={handle}>띄우기</button>
    </div>
  );
}
