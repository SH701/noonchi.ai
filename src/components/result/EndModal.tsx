"use client";

import Modal from "@/components/ui/modal/Modal";
import { useRouter } from "next/navigation";
import Image from "next/image";

import LoadingModal from "../chatroom/LoadingModal";
import { Button } from "../ui/button/button";
import { useEnd } from "@/hooks/mutations/useEnd";

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

  const { mutateAsync: endConversation, isPending } = useEnd();
  const handleEnd = async () => {
    if (!conversationId) return;
    try {
      await endConversation(conversationId);
      router.push(`/main/chatroom/${conversationId}/result`);
    } catch (error) {
      console.error("Error ending conversation:", error);
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
        <Button
          variant="primary"
          size="md"
          onClick={handleEnd}
          disabled={isPending}
        >
          {isPending ? "Loading..." : "Get Feedback"}
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={onClose}
          disabled={isPending}
        >
          Keep conversation
        </Button>
      </Modal>
      {isPending && <LoadingModal open={true} />}
    </>
  );
}
