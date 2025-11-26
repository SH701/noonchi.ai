"use client";

import ModalButton from "@/components/ui/button/ModalButton";
import FeedbackCloseButton from "@/components/ui/button/ModalCloseButton";
import Modal from "@/components/ui/modal/Modal";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/store/auth";
import { useState } from "react";
import LoadingModal from "../chats/LoadingModal";

interface EndModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
}

export default function EndModal({
  isOpen,
  onClose,
  conversationId,
}: EndModalProps) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [isLoading, setIsLoading] = useState(false);

  const handleEnd = async () => {
    if (!conversationId || !accessToken) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/conversations/${conversationId}/end`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        console.error("Failed to end conversation:", res.status);
        setIsLoading(false);
        return;
      }

      router.push(`/main/custom/chatroom/${conversationId}/result`);
    } catch (error) {
      console.error("Error ending conversation:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Would you like to end 
the conversation 
and receive feedback?"
        className="w-[320px] bg-white rounded-xl flex flex-col justify-center items-center px-4 py-12 gap-4"
      >
        <Image src="/etc/exitchar.svg" alt="exit" width={130} height={94} />
        <ModalButton
          label={isLoading ? "Loading..." : "Get Feedback"}
          onClick={handleEnd}
          disabled={isLoading}
        />
        <FeedbackCloseButton
          label="Keep conversation"
          onClick={onClose}
          disabled={isLoading}
        />
      </Modal>
      {isLoading && <LoadingModal open={true} />}
    </>
  );
}
