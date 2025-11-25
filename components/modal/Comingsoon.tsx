import Modal from "@/components/atoms/modal/Modal";
import Button from "@/components/atoms/button/ModalButton";
import { ModalProps } from "@/types/modal";

export default function ComingSoonModal({ isOpen, onClose }: ModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="This feature is coming soon"
      description={`Sorry for the inconvenience.\nWe're preparing a better experience for you`}
    >
      <div className="flex items-center justify-center">
        <Button label="Close" onClick={onClose} />
      </div>
    </Modal>
  );
}
