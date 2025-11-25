"use client";

import Button from "../atoms/button/ModalButton";
import Modal from "../atoms/modal/Modal";
import { useRouter } from "next/navigation";
interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: ComingSoonModalProps) {
  const router = useRouter();
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log in to save your interview and view your feedback"
      description=""
    >
      <div className="flex items-center justify-center">
        <Button
          label="Login / Sign up"
          onClick={() => router.push("/login")}
        ></Button>
      </div>
    </Modal>
  );
}
