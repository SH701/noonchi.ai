
import { ModalProps } from "@/types/modal";
import Modal from "../ui/modal/Modal";
import ModalButton from "../ui/button/ModalButton";

export default function ComingSoonModal({ isOpen, onClose }: ModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="This feature is coming soon"
      description={`Sorry for the inconvenience.\nWe're preparing a better experience for you`}
    >
      <div className="flex items-center justify-center">
        <ModalButton/>
      </div>
    </Modal>
  );
}
