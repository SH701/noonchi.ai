import { ModalProps } from "@/types/etc";
import Modal from "./Modal";
import { Button } from "../ui/button/button";

export default function ExitChatting({ isOpen, onClose }: ModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`There isn't enough conversasion yet \n to genereate a report`}
      description="A little more conversation will help"
    >
      <div className="flex flex-col gap-3 items-center justify-center">
        <Button variant="primary" size="md" onClick={onClose}>
          Close
        </Button>
        <Button variant="secondary" size="md" onClick={onClose}>
          Continue
        </Button>
      </div>
    </Modal>
  );
}
