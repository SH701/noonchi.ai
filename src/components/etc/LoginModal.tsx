"use client";

import { useRouter } from "next/navigation";
import Modal from "../ui/modal/Modal";
import Button from "../ui/button/ModalButton";
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
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
