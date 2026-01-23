"use client";

import Modal from "@/components/ui/modal/Modal";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/store/auth/useAuth";
import { useState } from "react";
import LoadingModal from "../chatroom/LoadingModal";
import { Button } from "../ui/button/button";

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

  const [isLoading, setIsLoading] = useState(false);

  // const handleEnd = async () => {
  //   if (!conversationId) return;
  //   setIsLoading(true);
  //   try {
  //     const res = await fetch(`/api/conversations/${conversationId}/end`, {
  //       method: "PUT",
  //       headers: { Authorization: `Bearer ${accessToken}` },
  //     });

  //     if (!res.ok) {
  //       console.error("Failed to end conversation:", res.status);
  //       setIsLoading(false);
  //       return;
  //     }

  //     router.push(`/main/chatroom/${conversationId}/result`);
  //   } catch (error) {
  //     console.error("Error ending conversation:", error);
  //     setIsLoading(false);
  //   }
  // };

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
        <Button
          variant="primary"
          size="md"
          onClick={handleEnd}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Get Feedback"}
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={onClose}
          disabled={isLoading}
        >
          Keep conversation
        </Button>
      </Modal>
      {isLoading && <LoadingModal open={true} />}
    </>
  );
}
